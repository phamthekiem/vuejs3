import { createUser, deleteUser, getRoles, getUsers, updateUser } from "@/api/UserService";
import { defineStore } from "pinia";

export interface User {
  id: string;
  fullName: string;
  avatar: string | null;
  department: string;
  address: string | null;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string | null;
  phoneNumberConfirmed: boolean;
  lockedOut: boolean;
  twoFactorEnabled: boolean;
  roles: string[];
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    currentPage: 1,
    totalUsers: 0,
    userPerPage: 5,
    roles: [] as string[],
  }),
  actions: {
    async fetchUsers(page: number = 1) {
      try {
        const response = await getUsers(page, this.userPerPage);
        this.users = response.data.items;
        this.totalUsers = response.data.itemsCount;
      } catch (error) {
        console.error('Error fetch', error);
        this.users = [];
        return { status: 'error', message: error.message };
      }
    },

    async fetchRoles() {
      try {
        const response = await getRoles();
        this.roles = response.data.items.map(role => role.name);
      } catch (error) {
        console.error('Error', error);
      }
    },

    async createUser(userData: User) {
      try {
        const response = await createUser(userData);
        if (response && response.data) {
          this.users.push(response.data);
          return { status: 'success', data: response.data };
        }
        return { status: 'error', message: 'No data returned' };
      } catch (error) {
        return { status: 'error', message: error.message };
      }
    },

    async updateSelectedUser(userData: User) {
      try {
        const response = await updateUser(userData);
        const index = this.users.findIndex(user => user.id === userData.id);
        if (index !== -1) {
          this.users[index] = response;
        }
        return { status: 'success', data: response }; 
      } catch (error) {
        console.error('Error store update', error);
        return { status: 'error', message: error.message }; 
      }
    },

    async deleteUser(userId: string) {
      try {
        await deleteUser(userId);
        this.users = this.users.filter(user => user.id !== userId);
      } catch (error) {
        console.error('Error delete', error);
      }
    },

  }
});
