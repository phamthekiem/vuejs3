import { getUsers } from "@/api/UserService";
import { defineStore } from "pinia";

export interface User {
  "id": "string",
  "fullName": "string",
  "avatar": "string",
  "department": "string",
  "address": "string",
  "userName": "string",
  "email": "string",
  "emailConfirmed": true,
  "phoneNumber": "string",
  "phoneNumberConfirmed": true,
  "lockedOut": true,
  "twoFactorEnabled": true,
  "roles": [
    "string"
  ],
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
  }),
  actions: {
    async fetchUsers() {
      try {
        const data = await getUsers();
        this.users = data;
      } catch (error) {
        console.log('Error', error)
      }
    }
  }
})
