<template>
  <b-modal
    v-model="localIsVisible"
    title="Edit User"
    @ok="saveUserChanges"
    hide-footer
    centered
    @hide="handleHide"
  >
    <template>
      <div>
        <b-form @submit.prevent="updateUser">
          <b-form-group label="Email Address *">
            <b-form-input type="email" v-model="user.email" required readonly></b-form-input>
          </b-form-group>
          <b-form-group label="User Name *">
            <b-form-input v-model="user.userName" required></b-form-input>
          </b-form-group>
          <b-form-group label="Full Name">
            <b-form-input v-model="user.fullName"></b-form-input>
          </b-form-group>
          <b-form-group label="Department">
            <b-form-select v-model="user.department" :options="departmentOptions"></b-form-select>
          </b-form-group>
          <b-form-group label="Roles">
            <b-form-select v-model="user.roles" :options="roleOptions"></b-form-select>
          </b-form-group>
          <b-button type="button" variant="secondary" @click="closeModal">Cancel</b-button>
          <b-button type="submit" variant="primary">Update User</b-button>
        </b-form>
      </div>
    </template>
  </b-modal>
</template>

<script lang="ts">
import { useUserStore } from '@/store/userStore';
import { computed, defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'EditUserModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:isVisible', 'save'],
  setup(props, { emit }) {
    const userStore = useUserStore();
    const user = ref({ ...props.user });

    const localIsVisible = ref(props.isVisible);

    watch(() => props.isVisible, (newValue) => {
      localIsVisible.value = newValue;
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

    const saveUserChanges = async () => {
      console.log('User information before update:', user.value); 

      try {
        const response = await userStore.updateUser(user.value.id, user.value);
        if ( response && response.success ) {
          userStore.fetchUsers();
          emit('save', props.user); 
          emit('update:isVisible', false);
          alert('User updated successfully!'); 
        }
      } catch (error) {
        console.error('Update user Failed', error);
        alert('Failed to update user. Please try again');
      }
    };

    const handleHide = () => {
      user.value = { ...props.user };
      emit('update:isVisible', false);
    };

    const closeModal = () => {
      handleHide();
      emit('update:isVisible', false);
    };

    return {
      localIsVisible,
      saveUserChanges,
      handleHide,
      user,
      closeModal,
      departmentOptions,
      roleOptions,
    };
  },
});
</script>
