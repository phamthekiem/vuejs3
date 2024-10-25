<template>
  <b-modal 
    v-model="internalShow" 
    title="Edit Role" 
    hide-footer
    centered
    size="lg"
    @hide="resetForm"
  >
    <div>
      <label for="roleName">Name *</label>
      <b-form-input id="roleName" v-model="roleName" required />

      <div v-for="permission in permissionsTree" :key="permission?.name" class="list-permission mb-4 mt-2">
        <div class="d-flex align-items-center full-permission">
          <b-form-checkbox 
            :id="permission.name" 
            v-model="permission.isChecked"
            @change="toggleChildren(permission)"
          />
          <label :for="permission.name">Full Permissions</label>
        </div>
        
        <div v-if="permission.children" class="ml-4 children-permission">
          <div v-for="child in permission.children" :key="child?.name">
            <div class="d-flex align-items-center">
              <b-form-checkbox 
                :id="child.name" 
                v-model="child.isChecked"
                @change="toggleChildren(child)"
              />
              <label :for="child.name">{{ child.name }}</label>
            </div>
            
            <div v-if="child.children" class="ml-4 children2-permission">
              <div v-for="subChild in child.children" :key="subChild?.name">
                <div class="d-flex align-items-center">
                  <b-form-checkbox 
                    :id="subChild.name" 
                    v-model="subChild.isChecked"
                    @change="toggleChildren(subChild)"
                  />
                  <label :for="subChild.name">{{ subChild.name }}</label>
                </div>

                <div v-if="subChild.children" class="ml-4 children3-permission">
                  <div v-for="subSubChild in subChild.children" :key="subSubChild?.name">
                    <div class="d-flex align-items-center">
                      <b-form-checkbox 
                        :id="subSubChild.name" 
                        v-model="subSubChild.isChecked"
                        @change="toggleChildren(subSubChild)"
                      />
                      <label :for="subSubChild.name">{{ subSubChild.name }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <b-button variant="secondary" @click="close">Cancel</b-button>
      <b-button variant="primary" @click="updateRole">Update</b-button>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Role, useRoleStore } from '@/store/roleStore';
import { defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
  name: 'EditRoleModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    role: {
      type: Object as () => Role,
      required: true
    }
  },

  setup(props, { emit }) {
    
    interface PermissionNode {
      name: string;
      children?: PermissionNode[];
      isChecked?: boolean;
    }

    const roleStore = useRoleStore();  
    const roleName = ref(props.role?.name);
    const internalShow = ref(props.modelValue);  
    const permissionsTree = ref<PermissionNode[]>([]); 

    watch(() => props.modelValue, (newVal) => {
      internalShow.value = newVal;
    });

    watch(() => props.role, (newRole) => {
      roleName.value = newRole?.name;
    });

    const close = () => {
      emit('update:modelValue', false);
    };

    const resetForm = () => {
      roleName.value = props.role.name;  // Reset data
      loadRolePermissions();  // Load permissions
    };

    watch(internalShow, (newVal) => {
      emit('update:modelValue', newVal);
    });

    // Permission tree
    const toggleChildren = (parentPermission: PermissionNode) => {
      const isChecked = parentPermission.isChecked;

      if (isChecked && parentPermission.children) {
        parentPermission.children.forEach(child => {
          child.isChecked = true; 
          if (child.children) {
            child.children.forEach(subChild => {
              subChild.isChecked = true;
              if (subChild.children) {
                subChild.children.forEach(subSubChild => {
                  subSubChild.isChecked = true;
                });
              }
            });
          }
        });
      } else if (!isChecked && parentPermission.children) {
        parentPermission.children.forEach(child => {
          child.isChecked = false; 
          if (child.children) {
            child.children.forEach(subChild => {
              subChild.isChecked = false;
              if (subChild.children) {
                subChild.children.forEach(subSubChild => {
                  subSubChild.isChecked = false;
                });
              }
            });
          }
        });
      }
    };

    const loadRolePermissions = async () => {
      try {
        const permissions = await roleStore.fetchRolePermissions();
        permissionsTree.value = buildPermissionTree(permissions);

        const currentPermissions = props.role?.permissions || [];
        markSelectedPermissions(permissionsTree.value, currentPermissions);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    const buildPermissionTree = (permissions: string[]): PermissionNode[] => {
      const root: PermissionNode[] = [];
      
      permissions.forEach((permissionString) => {
        const parts = permissionString.split('.');
        let currentLevel = root;

        parts.forEach((part, index) => {
          let existingNode = currentLevel.find((node) => node.name === part);

          if (!existingNode) {
            existingNode = { name: part, children: [] };
            currentLevel.push(existingNode);
          }
          currentLevel = existingNode.children || []; 
        });
      });

      return root;
    };

   
    const markSelectedPermissions = (permissionsTree: PermissionNode[], currentPermissions: string[]) => {
      permissionsTree.forEach((permission) => {
        if (currentPermissions.includes(permission.name)) {
          permission.isChecked = true;
        }
        if (permission.children) {
          markSelectedPermissions(permission.children, currentPermissions); 
        }
      });
    };

    onMounted(() => {
      loadRolePermissions();
    });

    // Update role
    const updateRole = async () => {
      if (roleName.value.trim()) {
        const selectedPermissions: string[] = [];

        const collectPermissions = (permissions: PermissionNode[]) => {
          permissions.forEach(permission => {
            if (permission.isChecked) {
              selectedPermissions.push(permission.name);
            }
            if (permission.children) {
              collectPermissions(permission.children);
            }
          });
        };

        collectPermissions(permissionsTree.value);

        // Call API
        const payload = {
          id: props.role.id,
          name: roleName.value,
          permissions: selectedPermissions
        };

        console.log(payload, 'payload');

        // try {
        //   const response = await roleStore.updateRole(payload as Role);
        //   if (response.success) {
        //     close();
        //     window.location.reload();
        //   } else {
        //     console.error('Invalid permissions data:', response);
        //   }
        // } catch (error) {
        //   console.error('Error updating role:', error);
        // }

      } else {
        alert("Role name cannot be empty.");
      }
    };

    return { 
      roleName, 
      internalShow,
      close, 
      updateRole, 
      resetForm,
      permissionsTree,
      toggleChildren,
    };
  }
});
</script>

<style scoped>
.ml-4 {
  margin-inline-start: 1.5rem;
}

.list-permission .children-permission {
  max-block-size: 50vh;
  overflow-y: auto;
}
</style>
