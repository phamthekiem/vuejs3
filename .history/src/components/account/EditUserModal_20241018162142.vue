<template>
  <b-modal 
  v-model="modelValue" 
  title="Edit User" 
  @hide="resetForm"
  hide-footer
  >
    <template>
    <b-modal 
      v-model="modelValue" 
      title="Edit User" 
      @hide="resetForm"
      hide-footer
    >
      <b-form @submit.prevent="editUser">
        <b-form-group label="User Name *">
          <b-form-input v-model="newUser.userName" required></b-form-input>
        </b-form-group>
        <!-- Other form groups can be added back one by one -->
      </b-form>
    </b-modal>
  </template>
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
      
      watch( () => props.modelValue, (newValue) => {
        if ( !newValue ) {
          resetForm();
        }
      });

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
      };
      
    },

  });

</script>
