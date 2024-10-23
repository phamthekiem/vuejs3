<template>
  <b-modal 
    v-model="internalShow" 
    title="Create New Role" 
    hide-footer
    centered
    size="lg"
    @hide="resetForm"
  >
    <div>
      <label for="roleName">Name *</label>
      <input type="text" id="roleName" v-model="roleName" />

      <div>
        <input type="checkbox" id="fullPermissions" v-model="fullPermissions" />
        <label for="fullPermissions">Full Permissions</label>
      </div>

      <!-- Permissions Section -->
      <div>
        <div style="padding-inline-start: 20px;">
          <input type="checkbox" id="identity" v-model="identityPermission" />
          <label for="identity">Identity</label>
        </div>
        <div v-if="identityPermission">
          <div style="padding-inline-start: 40px;">
            <input type="checkbox" id="user" v-model="userPermission" />
            <label for="user">User</label>
          </div>
          <div v-if="userPermission" style="padding-inline-start: 60px;">
            <input type="checkbox" id="userRead" v-model="permissions.user.read" />
            <label for="userRead">Read</label>
            <br />
            <input type="checkbox" id="userCreate" v-model="permissions.user.create" />
            <label for="userCreate">Create</label>
            <br />
            <input type="checkbox" id="userUpdate" v-model="permissions.user.update" />
            <label for="userUpdate">Update</label>
            <br />
            <input type="checkbox" id="userDelete" v-model="permissions.user.delete" />
            <label for="userDelete">Delete</label>
          </div>
        </div>

        <!-- Other Permissions like Role, Syslog -->
        <div style="padding-inline-start: 20px;">
          <input type="checkbox" id="role" v-model="rolePermission" />
          <label for="role">Role</label>
        </div>
        <div v-if="rolePermission" style="padding-inline-start: 60px;">
          <input type="checkbox" id="roleRead" v-model="permissions.role.read" />
          <label for="roleRead">Read</label>
          <br />
          <input type="checkbox" id="roleCreate" v-model="permissions.role.create" />
          <label for="roleCreate">Create</label>
          <br />
          <input type="checkbox" id="roleUpdate" v-model="permissions.role.update" />
          <label for="roleUpdate">Update</label>
          <br />
          <input type="checkbox" id="roleDelete" v-model="permissions.role.delete" />
          <label for="roleDelete">Delete</label>
        </div>
      </div>

      <b-button variant="secondary" @click="close">Cancel</b-button>
      <b-button variant="primary" @click="addRole">Submit</b-button>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { useRoleStore } from '@/store/roleStore';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'AddRoleModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const roleStore = useRoleStore();  // Use store
    const roleName = ref<string>('');  // Role name input
    const internalShow = ref<boolean>(props.modelValue);
    
    const fullPermissions = ref<boolean>(false);
    const identityPermission = ref<boolean>(false);
    const userPermission = ref<boolean>(false);
    const rolePermission = ref<boolean>(false);
    const permissions = ref({
      user: {
        read: false,
        create: false,
        update: false,
        delete: false
      },
      role: {
        read: false,
        create: false,
        update: false,
        delete: false
      }
    });

    watch(() => props.modelValue, (newVal) => {
      internalShow.value = newVal;
    });

    const close = () => {
      emit('update:modelValue', false);
    };

    const addRole = () => {
      const selectedPermissions: string[] = [];

      if (fullPermissions.value) {
        selectedPermissions.push('FULL');
      } else {
        if (permissions.value.user.read) selectedPermissions.push('user.read');
        if (permissions.value.user.create) selectedPermissions.push('user.create');
        if (permissions.value.user.update) selectedPermissions.push('user.update');
        if (permissions.value.user.delete) selectedPermissions.push('user.delete');
        if (permissions.value.role.read) selectedPermissions.push('role.read');
        if (permissions.value.role.create) selectedPermissions.push('role.create');
        if (permissions.value.role.update) selectedPermissions.push('role.update');
        if (permissions.value.role.delete) selectedPermissions.push('role.delete');
      }

      // Dispatch store action
      roleStore.createRole({
        name: roleName.value,
        permissions: selectedPermissions
      });

      close();
    };

    const resetForm = () => {
      roleName.value = '';
      fullPermissions.value = false;
      identityPermission.value = false;
      userPermission.value = false;
      rolePermission.value = false;
      permissions.value = {
        user: {
          read: false,
          create: false,
          update: false,
          delete: false
        },
        role: {
          read: false,
          create: false,
          update: false,
          delete: false
        }
      };
    };

    watch(internalShow, (newVal) => {
      emit('update:modelValue', newVal);
    });

    return {
      roleName,
      internalShow,
      fullPermissions,
      identityPermission,
      userPermission,
      rolePermission,
      permissions,
      close,
      addRole,
      resetForm
    };
  }
});
</script>
