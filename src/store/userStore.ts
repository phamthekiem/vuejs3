import {
  createUser,
  deleteUser,
  getActivities,
  getRoles,
  getUsers,
  loginUser,
  revokeAll,
  revokeUser,
  updateUser
} from "@/api/UserService";
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
    // Fetch users
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

    // Create user
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

    // Update user
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

    // Delete user
    async deleteUser(userId: string) {
      try {
        await deleteUser(userId);
        this.users = this.users.filter(user => user.id !== userId);
      } catch (error) {
        console.error('Error delete', error);
      }
    },

    // Update user lock status
    async updateUserLockStatus(userId: string, lockedOut: boolean) {
      try {
        const existingUser = this.users.find(user => user.id === userId);
        if (existingUser) {
          const updatedUser = { ...existingUser, lockedOut: lockedOut }; 
          const response = await updateUser(updatedUser);
          const index = this.users.findIndex(user => user.id === userId);
          if (index !== -1) {
            this.users[index].lockedOut = lockedOut;
          }
          return { status: 'success', data: response };
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error updating user lock status', error);
        return { status: 'error', message: error.message };
      }
    },

    // Login user
    async loginUser(email: string, password: string, reCaptcha: string, rememberMe: boolean) {
      try {
        const response = await loginUser(email, password, reCaptcha, rememberMe);
        return { status: 'success', data: response };
      } catch (error) {
        return { status: 'error', message: error.message };
      }
    },

    // Fetch activities
    async fetchActivities(userId: string) {
      try {
        const response = await getActivities(userId);
        return { status: 'success', data: response };
      } catch (error) {
        return { status: 'error', message: error.message };
      }
    },

    // Revoke user
    async revokeUser(userId: string, signedInAt: string) {
      try {
        const response = await revokeUser(userId, signedInAt);
        return { status: 'success', data: response };
      } catch (error) {
        return { status: 'error', message: error.message };
      }
    },

    // Revoke all
    async revokeAll(userId: string) {
      try {
        const response = await revokeAll(userId);
        return { status: 'success', data: response };
      } catch (error) {
        return { status: 'error', message: error.message };
      }
    },

    // Fetch roles
    async fetchRoles() {
      try {
        const response = await getRoles();
        this.roles = response.data.items.map(role => role.name);
      } catch (error) {
        console.error('Error', error);
        this.roles = [];
        return { status: 'error', message: error.message };
      }
    },

  }
});
