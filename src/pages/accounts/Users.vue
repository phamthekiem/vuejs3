<template>
  <div>
    <h1>User List</h1>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <!-- Search input -->
      <div>
        <b-form-input
          v-model="searchQuery"
          placeholder="Search..."
        ></b-form-input>
      </div>

      <div class="user-action d-flex gap-3 justify-content-end">
        <b-button @click="getActivityModal" :disabled="!hasSelectedUsers"><i class="ri-pulse-line"></i> Activity</b-button>
        <b-button @click="showCreateUserModal"><i class="ri-add-line"></i> New user</b-button>
        <b-button @click="editSelectedUsers(user)" :disabled="!hasSelectedUsers"><i class="ri-ball-pen-line"></i> Edit</b-button>
        <b-button @click="showDeleteConfirmation" :disabled="!hasSelectedUsers"><i class="ri-delete-bin-line"></i> Delete</b-button>
        <b-button @click="revokeAll" :disabled="!hasSelectedUsers"><i class="ri-close-circle-line"></i> Revoke All</b-button>

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
    </div>

    <!-- Activity modal -->
    <ActivityModal
      v-model="isActivityModalVisible"
      :isVisible="isActivityModalVisible"
      :user="selectedUser"
      :activities="newUsers"
      @update:isVisible="isActivityModalVisible = $event"
    ></ActivityModal>

    <!-- create user -->
    <CreateUserModal
      v-model="isCreateUserModalVisible"
      :isVisible="isCreateUserModalVisible"
      :user="selectedUser" 
      @update:isVisible="isCreateUserModalVisible = $event"
    ></CreateUserModal>

    <!-- Edit user -->
    <EditUserModal
      :isVisible="isEditUserModalVisible"
      :user="selectedUser"
      @update:isVisible="isEditUserModalVisible = $event"
      @save="saveUserChanges"
    />

    <b-table
      v-if="filteredUsers.length > 0"
      :items="filteredUsers"
      :fields="fields"
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
        <!-- {{ data.item.lockedOut ? 'Locked' : 'Unlocked' }} -->
        <b-form-checkbox 
          switch
          v-model="data.item.lockedOut"
          @change="updateUserLockStatus(data.item.id, data.item.lockedOut)"
        >
          {{ data.item.lockedOut ? 'Locked' : 'Unlocked' }}
        </b-form-checkbox>
      </template>
    </b-table>

    <div v-else>
      <p>No users</p>
    </div>

    <!-- Pagination -->
    <b-pagination
      v-model="currentPage"
      :total-rows="totalUsers"
      :per-page="usersPerPage"
      @change="fetchUsers($event)"
    ></b-pagination>

  </div>
</template>

<script lang="ts">
import ActivityModal from '@/components/account/ActivityModal.vue';
import CreateUserModal from '@/components/account/CreateUserModal.vue';
import EditUserModal from '@/components/account/EditUserModal.vue';
import { useUserStore } from '@/store/userStore';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'User',
  components: {
    CreateUserModal,
    EditUserModal,
    ActivityModal,
  },

  setup() {
    const userStore = useUserStore();
    const selectedUsers = ref([]);
    const isCreateUserModalVisible = ref(false);
    const isDeleteConfirmationVisible = ref(false);
    const selectedUser = ref(null);
    const isEditUserModalVisible = ref(false);
    const searchQuery = ref('');

    const router = useRouter();

    // Activity modal
    const isActivityModalVisible = ref(false);
    const newUsers = ref([]);

    const fetchActivities = async () => {
      const result = await userStore.fetchActivities(selectedUsers.value[0].id);
      if (result.status === 'success') {
        if ( typeof result.data === 'string') {
          newUsers.value = JSON.parse(result.data);
        } else {
          newUsers.value = result.data;
        }
      } else {
        console.error('Error fetching activities:', result.message);
      }
    };
    const getActivityModal = async () => {
      if (hasSelectedUsers.value) {
        selectedUser.value = selectedUsers.value[0]; 
        await fetchActivities();
        isActivityModalVisible.value = true;
      }
    };

    // Pagination
    const currentPage = ref(1);
    const usersPerPage = computed(() => userStore.userPerPage);
    const totalUsers = computed(() => userStore.totalUsers);

    // Fetch users
    const fetchUsers = async (page: number = currentPage.value) => {
      await userStore.fetchUsers(page);
    };

    onMounted(() => {
      fetchUsers();
    });
    
    const users = computed(() => userStore.users);

    // Filter users
    const filteredUsers = computed(() => {
      if (searchQuery.value) {
        return users.value.filter(
          user => user.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      return users.value.slice((currentPage.value - 1) * usersPerPage.value, currentPage.value * usersPerPage.value);
    });

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
      if (hasSelectedUsers.value) {
        selectedUser.value = selectedUsers.value[0];
        isDeleteConfirmationVisible.value = true;
      }
    };

    const confirmDeleteUser = async () => {
      if (selectedUser.value) {
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
    const hasSelectedUsers = computed(() => selectedUsers.value.length > 0);

    // Show modal create
    const showCreateUserModal = () => {
      isCreateUserModalVisible.value = true;
    };

    // Edit user
    const editSelectedUsers = (user) => {
      if (hasSelectedUsers.value) {
        if (selectedUsers.value.length > 0) {
          selectedUser.value = selectedUsers.value[0]; 
          isEditUserModalVisible.value = true; 
        }
      }
    };

    // Save user changes
    const saveUserChanges = async () => {
      if (selectedUser.value) {
        if (typeof userStore.updateSelectedUser === 'function') {
          await userStore.updateSelectedUser(selectedUser.value.id, selectedUser.value);
          isEditUserModalVisible.value = false;
        } else {
          console.error('updateUser is not a function in userStore');
        }
      }
    };

    // Update user lock status
    const updateUserLockStatus = async (userId) => {
      const result = await userStore.updateUserLockStatus(userId, selectedUsers.value.lockedOut);
      if (result.status === 'success') {
        selectedUsers.value.lockedOut = !selectedUsers.value.lockedOut;
      }
    };

    // Revoke all
    const revokeAll = async () => {
      if (hasSelectedUsers.value) {
        await userStore.revokeAll(selectedUsers.value[0].id);
        router.push('/login');
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
      saveUserChanges,
      searchQuery,
      filteredUsers,
      fetchUsers,
      currentPage,
      usersPerPage,
      totalUsers,
      getActivityModal,
      isActivityModalVisible,
      newUsers,
      revokeAll,
      updateUserLockStatus,
    };
  },
});
</script>

<style lang="scss">
.table {
  // --bs-table-bg: no-repeat;
  // --bs-table-border-color: #ddd;
  // --bs-table-color: #ddd;
  // --bs-table-striped-color: #ddd;

  // border-color: #ccc6;
}
</style>
