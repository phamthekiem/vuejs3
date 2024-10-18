<template>
  <div>
    <h1>User List</h1>
    <div class="user-action">
      <b-button @click="showCreateUserModal">New user</b-button>
      <b-button @click="editSelectedUsers" :disabled="!hasSelectedUsers">Edit</b-button>
      <b-button @click="deleteSelectedUsers" :disabled="!hasSelectedUsers">Delete</b-button>
    </div>

    <!-- create user -->
    <CreateUserModal
      v-model="isCreateUserModalVisible"
    ></CreateUserModal>

    <b-table
      v-if="users && users.length > 0"
      :items="users"
      :fields="fields"
      striped
      hover
      responsive
      v-model="selectedUsers"
    >
      <template #cell(fullName)="data">
        <b-form-checkbox
          v-model="data.item.selected"
          @change="updateSelectedUsers(data.item)"
        ></b-form-checkbox>
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
  import CreateUserModal from '@/components/user/CreateUserModal.vue';

  export default defineComponent({
    name: 'User',
    components: {
      CreateUserModal,
    },

    setup() {
      const userStore = useUserStore();
      const selectedUsers = ref([]);
      const isCreateUserModalVisible = ref(false);

      onMounted(() => {
        userStore.fetchUsers();
      });
      
      const users = computed(() => userStore.users);
      const fields = [
        { key: 'select', label: ' ' },
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

      const deleteSelectedUsers = async () => {
        if ( selectedUsers.value.length > 0 ) {
          await userStore.deleteUser(selectedUsers.value[0].id);
          selectedUsers.value = [];
        }
      };

      const hasSelectedUsers = computed( () => selectedUsers.value.length > 0 );

      const showCreateUserModal = () => {
        isCreateUserModalVisible.value = true;
      };

      const editSelectedUsers = () => {

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
        updateSelectedUsers,
      };
    },
  });
</script>

