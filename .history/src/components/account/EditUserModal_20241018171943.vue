<template>
  <b-modal 
  v-model="modelValue" 
  title="Edit User" 
  @hide="resetForm"
  hide-footer
  >
    <b-form @submit.prevent="editSelectedUser">
      <b-form-group label="Email Address *">
        <b-form-input type="email" v-model="newUser.email" readonly></b-form-input>
      </b-form-group>
      <b-form-group label="User Name *">
        <b-form-input v-model="newUser.userName" required></b-form-input>
      </b-form-group>

      <b-form-group label="Full Name">
        <b-form-input v-model="newUser.fullName"></b-form-input>
      </b-form-group>
      <b-form-group label="Department">
        <b-form-select v-model="newUser.department" :options="departmentOptions"></b-form-select>
      </b-form-group>
      <b-form-group label="Roles">
        <b-form-select v-model="newUser.roles" :options="roleOptions"></b-form-select>
      </b-form-group>
      <b-button type="button" variant="secondary" @click="closeModal">Cancel</b-button>
      <b-button type="submit" variant="primary">Edit User</b-button>
    </b-form>
  </b-modal>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, watch } from 'vue';
  import { useUserStore } from '@/store/userStore';

  export default defineComponent({
    name: 'EditUserModal',

    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
      user: { // Add user prop to receive selected user data
        type: Object,
        required: true,
      },
    },

    setup(props, { emit }) {
      const userStore = useUserStore();
      const newUser = ref({
        email: '',
        userName: '',
        fullName: '',
        department: null,
        roles: null,
      });

      watch(() => props.user, (newUserData) => {
        if (newUserData) {
          newUser.value = { ...newUserData }; // Populate form with selected user data
        }
      });

      const departmentOptions = ref([
        { value: null, text: '--Select--'},
        { value: 'CEO', text: 'CEO'},
        { value: 'DEV', text: 'DEV'},
        { value: 'Design', text: 'Design'},
        { value: 'Sale', text: 'Sale'},
      ]);

      const roleOptions = computed(() => userStore.roles);
      userStore.fetchRoles();
      
      const editSelectedUser = async () => {
        try {
          const response = await userStore.updateUser(newUser.value); // Call updateUser with newUser data
          console.log(response, 'hit Edit');
          
          emit('update:modelValue', false);
        } catch (error) {
          console.error('Error edit new user', error);
          alert('Failed to edit user. Please try again');
        }
      };

      const resetForm = () => {
        newUser.value = {
          email: '',
          userName: '',
          fullName: '',
          department: null,
          roles: null,
        };
      };

      const closeModal = () => {
        emit('update:modelValue', false);
      };

      return {
        newUser,
        closeModal,
        departmentOptions,
        roleOptions,
        editSelectedUser,
      };
      
    },

  });

</script>
