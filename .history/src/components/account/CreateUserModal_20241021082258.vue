<template>
  <b-modal 
    v-model="modelValue" 
    title="Create New User" 
    @hide="resetForm"
    hide-footer
  >
    <b-form @submit.prevent="createNewUser">
      <b-form-group label="Email Address *">
        <b-form-input type="email" v-model="newUser.email" required></b-form-input>
      </b-form-group>
      <b-form-group label="User Name *">
        <b-form-input v-model="newUser.userName" required></b-form-input>
      </b-form-group>
      <b-form-group label="Password *">
        <b-form-input type="password" v-model="newUser.password" required></b-form-input>
      </b-form-group>
      <b-form-group label="Confirm password *">
        <b-form-input type="password" v-model="newUser.confirmPassword" required></b-form-input>
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

      <div v-if="errorMessage" class="text-danger">
        {{ errorMessage }}
      </div>

      <b-button type="button" variant="secondary" @click="closeModal">Cancel</b-button>
      <b-button type="submit" variant="primary">Create User</b-button>
    </b-form>
  </b-modal>
</template>

<script lang="ts">
import { useUserStore } from '@/store/userStore';
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CreateUserModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  
  setup(props, { emit }) {
    const userStore = useUserStore();
    const newUser = ref({
      email: '',
      userName: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      department: null,
      roles: [], 
    });

    const departmentOptions = ref([
      { value: null, text: '--Select--' },
      { value: 'IT', text: 'IT' },
      { value: 'HR', text: 'HR' },
      { value: 'Design', text: 'Design' },
      { value: 'Sales', text: 'Sales' },
    ]);

    const roleOptions = computed(() => userStore.roles);
    userStore.fetchRoles();

    const errorMessage = ref('');

    const createNewUser = async () => {
      errorMessage.value = '';
      
      if (!newUser.value.email || !newUser.value.userName || !newUser.value.password || !newUser.value.confirmPassword) {
        errorMessage.value = 'Please fill out all required fields';
        return;
      }

      if (newUser.value.password !== newUser.value.confirmPassword) {
        errorMessage.value = 'Passwords do not match';
        return;
      }

      if (typeof newUser.value.roles === 'string') {
        newUser.value.roles = [newUser.value.roles];
      }

      try {
        const response = await userStore.createUser(newUser.value);
        if (response && response.status === 'success') {
          userStore.fetchUsers();
          resetForm();
          emit('update:modelValue', false);
          alert('User created successfully!');
        } else {
          errorMessage.value = response.message || 'Failed to create user';
        }
      } catch (error) {
        errorMessage.value = error.message || 'Failed to create user. Please try again';
      }
    };

    const resetForm = () => {
      newUser.value = {
        email: '',
        userName: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        department: null,
        roles: [],
      };
      errorMessage.value = '';
    };

    const closeModal = () => {
      resetForm();
      emit('update:modelValue', false);
    };

    return {
      newUser,
      createNewUser,
      closeModal,
      resetForm,
      departmentOptions,
      roleOptions,
      errorMessage,
    };
  },
});
</script>
