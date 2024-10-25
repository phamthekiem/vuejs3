<template>
  <div>
    <h3>Roles & Permissions</h3>
    <div class="role-items">
      <div class="add-role text-end mb-3">
        <b-button variant="outline-primary" @click="openAddRoleModal"><i class="ri-add-line"></i> Add Role</b-button>
      </div>
      <AddRoleModal v-model="showAddRoleModal" />

      <div class="row list-role">
        <div class="col-md-3 col-12" v-for="role in roles" :key="role?.name">
          <div class="role-card">
            <div class="role-header mb-2 d-flex justify-content-between">
              <div class="role-avatar d-flex">
                <span v-for="(user, index) in role?.users" :key="index" class="user-img">{{ user.avatar }}</span>
              </div>
              <div class="role-actions">
                <b-button variant="link" @click="openEditRoleModal(role)"><i class="ri-pencil-line"></i></b-button>
                <b-button variant="link" class="text-danger" @click="openDeleteRoleModal(role)"><i class="ri-delete-bin-line"></i></b-button>
              </div>
            </div>
            <div class="role-name font-weight-bold fs-5">{{ role?.name }}</div>
            <div class="user-count text-gray">{{ role?.usersCount }} user{{ role?.usersCount > 1 ? 's' : '' }}</div>
          </div>
        </div>
      </div>

      <!-- Edit role modal -->
      <EditRoleModal 
        v-model="showEditRoleModal" 
        @update:isVisible="showEditRoleModal = $event"
        :role="selectedRole || {}"
      />

      <!-- Delete role modal -->
      <DeleteRoleModal 
        v-model="showDeleteRoleModal" 
        @update:isVisible="showDeleteRoleModal = $event"
        :role="selectedRoleDelete || {}"
        :deleteModalShow="showDeleteRoleModal"
      />
    </div>
  </div>
</template>

<script lang="ts">
import AddRoleModal from '@/components/account/AddRoleModal.vue';
import DeleteRoleModal from '@/components/account/DeleteRoleModal.vue';
import EditRoleModal from '@/components/account/EditRoleModal.vue';
import { Role, useRoleStore } from '@/store/roleStore';
import { computed, defineComponent, onMounted } from 'vue';
export default defineComponent({
  name: 'Roles',
  components: {
    AddRoleModal,
    EditRoleModal,
    DeleteRoleModal
  },
  setup() {
    const roleStore = useRoleStore();
    
    // Fetch roles
    onMounted(() => {
      roleStore.fetchRoles();
    });
    const roles = computed(() => roleStore.roles);

    // Add role modal
    const showAddRoleModal = ref(false);
    const openAddRoleModal = () => {
      showAddRoleModal.value = true;
    };

    // Edit role modal
    const showEditRoleModal = ref(false);
    const selectedRole = ref<Role | null>(null);
    const openEditRoleModal = (role: Role) => {
      selectedRole.value = role;
      showEditRoleModal.value = true;
    };

    // Delete role modal
    const showDeleteRoleModal = ref(false);
    const selectedRoleDelete = ref<Role | null>(null);
    const openDeleteRoleModal = (role: Role) => {
      selectedRoleDelete.value = role;
      showDeleteRoleModal.value = true;
    };


    return { 
      roles,
      showAddRoleModal,
      openAddRoleModal,
      showEditRoleModal,
      selectedRole,
      openEditRoleModal,
      showDeleteRoleModal,
      selectedRoleDelete,
      openDeleteRoleModal,
    };


  },
});
</script>

<style scoped>
.role-card {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-block-end: 10px;
}

.user-img {
  border: 1px solid;
  border-radius: 50%;
  background: #78798a;
  color: white;
  inline-size: 37px;
  margin-inline-end: -15px;
}

</style>
