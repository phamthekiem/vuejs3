<!-- src/components/UserList.vue -->
<template>
  <div>
    <h2>User List</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{ user.fullName }} - {{ user.email }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '@/store/userStore';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const userStore = useUserStore();

    onMounted(() => {
      userStore.fetchUsers();
    });

    return {
      users: userStore.users,
      fetchUsers: userStore.fetchUsers,
    };
  },
});
</script>
