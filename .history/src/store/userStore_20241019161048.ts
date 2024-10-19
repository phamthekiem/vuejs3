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
  }),
  actions: {
    async fetchUsers() {
      try {
        const response = await getUsers();
        this.users = response.data.items;
        console.log('store:', this.users); 
      } catch (error) {
        console.error('Error fetch', error);
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
        this.users.push(response);
      } catch (error) {
        console.error('Error create', error);
      }
    },

    async updateSelectedUser(userData: User) {
      try {
        const response = await updateUser(userData);
        console.log('Store response:', response);
        const index = this.users.findIndex(user => user.id === userData.id);
        if (index !== -1) {
          this.users[index] = response;
        }
      } catch (error) {
        console.error('Error store update', error);
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
