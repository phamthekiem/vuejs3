<template>
  <b-modal 
  v-model="modelValue" 
  title="Create New User" 
  @hide="resetForm"
  hide-footer
  >
    <b-form @submit.prevent="createNewUser">
      <b-form-group label="Email Address *">
        <b-form-input type="email" v-model="newUser.email" required @blur="checkEmailExists"></b-form-input>
        <b-form-text v-if="emailExists" style="color: #dc3545 !important;">Email has already been taken.</b-form-text>
      </b-form-group>
      <b-form-group label="User Name *">
        <b-form-input v-model="newUser.userName" required></b-form-input>
      </b-form-group>
      <b-form-group label="Password *">
        <b-form-input type="password" v-model="newUser.password" required @input="checkPasswordMatch"></b-form-input>
      </b-form-group>
      <b-form-group label="Confirm password *">
        <b-form-input type="password" v-model="newUser.confirmPassword" required @input="checkPasswordMatch"></b-form-input>
        <b-form-text v-if="passwordMisMatch" style="color: #dc3545 !important;">'ConfirmPassword' and 'Password' do not match.</b-form-text>
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
      <b-button type="submit" variant="primary">Create User</b-button>
    </b-form>
  </b-modal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useUserStore } from '@/store/userStore';

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
        roles: null,
      });

      const departmentOptions = ref([
        { value: null, text: '--Select--'},
        { value: 'CEO', text: 'CEO'},
        { value: 'DEV', text: 'DEV'},
        { value: 'Design', text: 'Design'},
        { value: 'Sale', text: 'Sale'},
      ]);

      const emailExists = ref(false);
      const checkEmailExists = async () => {
        emailExists.value = await userStore.checkEmailExists(newUser.value.email);
      };

      const roleOptions = computed( () => userStore.roles);
      userStore.fetchRoles();

      const passwordMisMatch = ref(false);
      const checkPasswordMatch = () => {
        passwordMisMatch.value = newUser.value.password !== newUser.value.confirmPassword;
      };
      
      const createNewUser = async () => {
        if ( !newUser.value.email ||
        !newUser.value.userName ||
        !newUser.value.password ||
        !newUser.value.confirmPassword
        ) {
          return;
        }
        
        if (passwordMisMatch.value) {
          return; 
        }

        try {
          const response = await userStore.createUser(newUser.value);
          if (response && response.success) { 
            userStore.fetchUsers();
            resetForm();
            emit('update:modelValue', false);
            alert('User created successfully!'); 
          } else {
            throw new Error('Failed to create user'); 
          }
        } catch (error) {
          console.error('Error create new user', error);
          alert('Failed to create user. Please try again');
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
          roles: null,
        };
      };

      const closeModal = () => {
        resetForm();
        emit('update:modelValue', false);
      };

      return {
        newUser,
        createNewUser,
        closeModal,
        departmentOptions,
        roleOptions,
        passwordMisMatch,
        checkPasswordMatch,
      };
      
    },

  });

</script>
