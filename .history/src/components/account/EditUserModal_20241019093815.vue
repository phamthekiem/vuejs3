<template>
  <b-modal
    v-model="localIsVisible"
    title="Edit User"
    @ok="saveUserChanges"
    hide-footer
    centered
    @hide="handleHide"
  >
    <b-form @submit.prevent="saveUserChanges">
      <b-form-group label="Email Address *">
        <b-form-input type="email" v-model="localUser.email" required readonly></b-form-input>
      </b-form-group>
      <b-form-group label="User Name *">
        <b-form-input v-model="localUser.userName" required></b-form-input>
      </b-form-group>
      <b-form-group label="Full Name">
        <b-form-input v-model="localUser.fullName"></b-form-input>
      </b-form-group>
      <b-form-group label="Department">
        <b-form-select v-model="localUser.department" :options="departmentOptions"></b-form-select>
      </b-form-group>
      <b-form-group label="Roles">
        <b-form-select v-model="localUser.roles" :options="roleOptions"></b-form-select>
      </b-form-group>
      <b-button type="button" variant="secondary" @click="closeModal">Cancel</b-button>
      <b-button type="submit" variant="primary">Update User</b-button>
    </b-form>
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
      default: () => ({}),
    },
  },
  emits: ['update:isVisible', 'save'],
  setup(props, { emit }) {
    const userStore = useUserStore();

    // Create a local copy of user data to avoid mutating props directly
    const localUser = ref({ ...props.user });

    const localIsVisible = ref(props.isVisible);

    // Watch for prop changes and update local copies
    watch(
      () => props.isVisible,
      (newValue) => {
        localIsVisible.value = newValue;
        // Reset local user data when modal is opened
        if (newValue) {
          localUser.value = { ...props.user };
        }
      }
    );

    // Watch for changes in the user prop and update localUser accordingly
    watch(
      () => props.user,
      (newUser) => {
        localUser.value = { ...newUser };
      }
    );

    const departmentOptions = ref([
      { value: null, text: '--Select--' },
      { value: 'CEO', text: 'CEO' },
      { value: 'DEV', text: 'DEV' },
      { value: 'Design', text: 'Design' },
      { value: 'Sale', text: 'Sale' },
    ]);

    const roleOptions = computed(() => userStore.roles);

    // Fetch roles once when component is mounted
    userStore.fetchRoles();

    const saveUserChanges = async () => {
      console.log('User information before update:', localUser.value);

      try {
        const response = await userStore.updateUser(localUser.value.id, localUser.value);
        if (response && response.success) {
          userStore.fetchUsers();
          emit('save', localUser.value);
          emit('update:isVisible', false);
          alert('User updated successfully!');
        }
      } catch (error) {
        console.error('Update user failed', error);
        alert('Failed to update user. Please try again');
      }
    };

    const handleHide = () => {
      // Reset local user data on modal hide
      localUser.value = { ...props.user };
      emit('update:isVisible', false);
    };

    const closeModal = () => {
      handleHide();
    };

    return {
      localIsVisible,
      saveUserChanges,
      handleHide,
      localUser,
      closeModal,
      departmentOptions,
      roleOptions,
    };
  },
});
</script>
