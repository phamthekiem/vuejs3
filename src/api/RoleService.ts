import apiClient from '@/config/apiClient';
import { Role } from '@/store/roleStore';

// Get roles
export const fetchRoles = async (page: number, limit: number) => {
  try {
    const response = await apiClient.get('/id/Role/GetRoles', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching roles');
  }
};

// Get role by ID
export const getRoleById = async (roleId: string) => {
  try {
    const response = await apiClient.get(`/id/Role/GetRole/${roleId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching role');
  }
};

// Get roles names
export const getRolesNames = async () => {
  try {
    const response = await apiClient.get('/id/Role/GetNames');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching roles names');
  }
};

// Get role permissions
export const getRolePermissions = async () => {
  try {
    const response = await apiClient.get('/id/Role/GetPermissions');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching role permissions');
  }
};

// Create role
export const createRole = async (roleData: Role) => {
  try {
    const response = await apiClient.post('/id/Role/Create', roleData);
    return response.data;
  } catch (error) {
    throw new Error('Error creating role');
  }
};

// Update role
export const updateRole = async (roleData: Role) => {
  try {
    const response = await apiClient.put('/id/Role/Update', roleData);
    return response.data;
  } catch (error) {
    throw new Error('Error updating role');
  }
};

// Update role by ID
export const updateRoleById = async (roleId: string) => {
  try {
    const response = await apiClient.patch(`/id/Role/Update/${roleId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error updating role');
  }
};

// Delete role
export const deleteRole = async (roleId: string) => {
  try {
    const response = await apiClient.delete(`/id/Role/Delete/${roleId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error deleting role');
  }
};
