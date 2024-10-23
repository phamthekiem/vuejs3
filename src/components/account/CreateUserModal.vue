<template>
  <b-modal 
    v-model="modelValue" 
    title="Create New User" 
    @hide="resetForm"
    hide-footer
    centered
    size="lg"
  >
    <b-form @submit.prevent="createNewUser" class="row">
      <b-form-group label="Email Address *" class="col-md-6 col-12">
        <b-form-input type="email" v-model="newUser.email" required></b-form-input>
      </b-form-group>
      <b-form-group label="User Name *" class="col-md-6 col-12">
        <b-form-input v-model="newUser.userName" required></b-form-input>
      </b-form-group>
      <b-form-group label="Password *" class="col-md-6 col-12">
        <b-form-input type="password" v-model="newUser.password" required></b-form-input>
      </b-form-group>
      <b-form-group label="Confirm password *" class="col-md-6 col-12">
        <b-form-input type="password" v-model="newUser.confirmPassword" required></b-form-input>
      </b-form-group>

      <b-form-group label="Full Name" class="col-md-6 col-12">
        <b-form-input v-model="newUser.fullName"></b-form-input>
      </b-form-group>
      <b-form-group label="Department" class="col-md-6 col-12">
        <b-form-select v-model="newUser.department" :options="departmentOptions"></b-form-select>
      </b-form-group>
      <b-form-group label="Roles" class="col-md-12">
        <b-form-select v-model="newUser.roles" :options="roleOptions"></b-form-select>
      </b-form-group>

      <div v-if="errorMessage" class="text-danger">
        {{ errorMessage }}
      </div>

      <b-button type="button" variant="secondary" @click="closeModal" class="col-md-6 col-12">Cancel</b-button>
      <b-button type="submit" variant="primary" class="col-md-6 col-12" >Create User</b-button>
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

    // Define modelValue
    const modelValue = computed({
      get: () => props.isVisible,
      set: (value) => emit('update:isVisible', value),
    });

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
      modelValue,
    };
  },
});
</script>
