import {
  createRole,
  deleteRole,
  fetchRoles,
  getRolePermissions,
  updateRole
} from "@/api/RoleService";
import { defineStore } from "pinia";

export interface Role {
  id: string;
  name: string;
  usersCount: number;
  permissions: string[];
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
        console.error('Error fetching roles', error);
        this.roles = [];
        return { status: 'error', message: error.message };
      }
    },

    // Fetch role permissions
    async fetchRolePermissions() {
      try {
        const response = await getRolePermissions();
        return response.data;
      } catch (error) {
        console.error('Error fetching role permissions', error);
        return { status: 'error', message: error.message };
      }
    },

    // Add role
    async createRole(roleData: Role) {
      try {
        const response = await createRole(roleData);
        this.roles.push(response);
        return response;
      } catch (error) {
        console.error('Error creating role', error);
        return { status: 'error', message: error.message };
      }
    },

    // Edit role
    async updateRole(roleData: Role) {
      try {
        const response = await updateRole(roleData);
        return response;
      } catch (error) {
        console.error('Error updating role', error);
        return { status: 'error', message: error.message };
      }
    },

    // Delete role
    async deleteRole(roleId: string) {
      try {
        const response = await deleteRole(roleId);
        return response;
      } catch (error) {
        console.error('Error deleting role', error);
        return { status: 'error', message: error.message };
      }
    }
  }
});
