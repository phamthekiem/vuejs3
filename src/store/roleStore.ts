import {
  createRole,
  fetchRoles
} from "@/api/RoleService";
import { defineStore } from "pinia";

export interface Role {
  id: string;
  name: string;
  usersCount: number;
  users: {
    userName: string;
    email: string;
    avatar: string | null;
    fullName: string;
  }[];
}

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [] as Role[],
    currentPage: 1,
    totalRoles: 0,
    rolesPerPage: 5,
  }),
  actions: {
    // Fetch roles
    async fetchRoles(page: number = 1) {
      try {
        const response = await fetchRoles(page, this.rolesPerPage);
        this.roles = response.data.items;
        this.totalRoles = response.data.itemsCount;
      } catch (error) {
        console.error('Error', error);
        this.roles = [];
        return { status: 'error', message: error.message };
      }
    },

    // Add role
    async addRole(roleName: string) {
      try {
        const response = await createRole({ name: roleName });
        this.roles.push(response.data);
      } catch (error) {
        console.error('Error', error);
        return { status: 'error', message: error.message };
      }
    },

  }
});
