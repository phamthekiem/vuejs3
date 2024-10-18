<template>
  <div>
    <h1>User List</h1>
    <div class="user-action d-flex gap-3 mr-auto">
      <b-button @click="showCreateUserModal">New user</b-button>
      <b-button @click="editSelectedUsers" :disabled="!hasSelectedUsers">Edit</b-button>
      <b-button @click="showDeleteConfirmation" :disabled="!hasSelectedUsers">Delete</b-button>

      <!-- Confirm delete user -->
      <b-modal
        v-model="isDeleteConfirmationVisible"
        title="Confirm Deletion"
        ok-title="Yes, delete it!"
        cancel-title="Cancel"
        @ok="confirmDeleteUser"
        ok-variant="danger" 
        hide-footer
        centered 
      >
        <div class="text-center">
          <div class="icon-warning"><i class="ri-error-warning-line"></i></div>
          <b>Are you sure you want to delete "{{ selectedUser?.fullName }}" account?</b>
          <p>You won't be able to revert this!</p>
        </div>
        <div class="text-center">
          <b-button variant="danger" @click="confirmDeleteUser">Yes, delete it!</b-button>
          <b-button @click="isDeleteConfirmationVisible = false">Cancel</b-button>
        </div>
      </b-modal>
    </div>

    <!-- create user -->
    <CreateUserModal
      v-model="isCreateUserModalVisible"
    ></CreateUserModal>

    <!-- Edit user -->
    <EditUserModal
      v-model="isEditUserModalVisible"
      :user="selectedUser"
    ></EditUserModal>

    <b-table
      v-if="users && users.length > 0"
      :items="users"
      :fields="fields"
      striped
      hover
      responsive
      v-model="selectedUsers"
    >
      <template #cell(select)="data">
        <b-form-checkbox
          v-model="data.item.selected"
          @change="updateSelectedUsers(data.item)"
        ></b-form-checkbox>
      </template>

      <template #cell(fullName)="data">
        <strong>{{ data.item.fullName }}</strong>
        <p>{{ data.item.email }}</p>
      </template>
      <template #cell(department)="data">
        {{ data.item.department }}
      </template>
      <template #cell(roles)="data">
        {{ data.item.roles[0] }}
      </template>
      <template #cell(twoFAEnabled)="data">
        {{ data.item.twoFAEnabled ? 'Enabled' : 'Disabled' }}
      </template>
      <template #cell(locked)="data">
        {{ data.item.lockedOut ? 'Locked' : 'Unlocked' }}
      </template>
    </b-table>

    <div v-else>
      <p>No users</p>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, computed, ref } from 'vue';
  import { useUserStore } from '@/store/userStore';
  import CreateUserModal from '@/components/account/CreateUserModal.vue';
  import EditUserModal from '@/components/account/EditUserModal.vue';

  export default defineComponent({
    name: 'User',
    components: {
      CreateUserModal,
      EditUserModal,
    },

    setup() {
      const userStore = useUserStore();
      const selectedUsers = ref([]);
      const isCreateUserModalVisible = ref(false);
      const isDeleteConfirmationVisible = ref(false);
      const selectedUser = ref(null);
      const isEditUserModalVisible = ref(false);

      onMounted(() => {
        userStore.fetchUsers();
      });
      
      const users = computed(() => userStore.users);
      const fields = [
        { key: 'select', label: '' },
        { key: 'fullName', label: 'User' },
        { key: 'department', label: 'Department' },
        { key: 'roles', label: 'Roles' },
        { key: 'twoFAEnabled', label: '2FA Enabled' },
        { key: 'locked', label: 'Locked out' },
      ];

      const updateSelectedUsers = (user) => {
        if (user.selected) {
          selectedUsers.value.push(user);
        } else {
          selectedUsers.value = selectedUsers.value.filter(u => u.id !== user.id);
        }
      };

      // Delete user
      const showDeleteConfirmation = () => {
        if ( hasSelectedUsers.value ) {
          selectedUser.value = selectedUsers.value[0];
          isDeleteConfirmationVisible.value = true;
        }
      };

      const confirmDeleteUser = async () => {
        if ( selectedUser.value ) {
          await userStore.deleteUser(selectedUser.value.id);
          selectedUser.value = [];
          isDeleteConfirmationVisible.value = false;
        }
      };

      const deleteSelectedUsers = async () => {
        for (const user of selectedUsers.value) {
          if (user.selected) {
            await userStore.deleteUser(user.id);
          }
        }
        selectedUsers.value = []; 
      };

      // select user
      const hasSelectedUsers = computed( () => selectedUsers.value.length > 0 );

      // Show modal create
      const showCreateUserModal = () => {
        isCreateUserModalVisible.value = true;
      };

      // Edit user
      const editSelectedUsers = () => {
        if (hasSelectedUsers.value) {
          // selectedUser.value = selectedUser.value[0];
          isEditUserModalVisible.value = true; 
        }
      };

      return {
        users,
        fields,
        selectedUsers,
        hasSelectedUsers,
        showCreateUserModal,
        isCreateUserModalVisible,
        editSelectedUsers,
        deleteSelectedUsers,
        isDeleteConfirmationVisible,
        showDeleteConfirmation,
        confirmDeleteUser,
        selectedUser,
        updateSelectedUsers,
        isEditUserModalVisible,
      };
    },
  });
</script>

<style lang="scss">
  .table {
    --bs-table-bg: no-repeat;
    --bs-table-border-color: #ddd;
    --bs-table-color: #ddd;
    --bs-table-striped-color: #ddd;

    border-color: #ccc6;
  }
</style>
