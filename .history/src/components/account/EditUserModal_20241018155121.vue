<template>
  <b-modal 
  v-model="modelValue" 
  title="Create New User" 
  @hide="resetForm"
  hide-footer
  >
    <b-form @submit.prevent="editUser">
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
  import { defineComponent, ref } from 'vue';
  import { useUserStore } from '@/store/userStore';

  export default defineComponent({
    name: 'EditUserModal',

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

      const roleOptions = computed( () => userStore.roles);
      userStore.fetchRoles();
      
      

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
        resetForm();
        emit('update:modelValue', false);
      };

      return {
        newUser,
        closeModal,
        departmentOptions,
        roleOptions,
      };
      
    },

  });

</script>
