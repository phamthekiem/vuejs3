<template>
  <b-modal
    v-model="localIsVisible"
    title="Edit User"
    hide-footer
    centered
    @hide="handleHide"
    size="lg"
  >
    <b-form @submit.prevent="saveUserChanges" class="row">
      <b-form-group label="Email Address *" class="col-md-6 col-12">
        <b-form-input type="email" :placeholder="localUser.email" required readonly ></b-form-input>
      </b-form-group>
      <b-form-group label="User Name *" class="col-md-6 col-12">
        <b-form-input v-model="localUser.userName" required></b-form-input>
      </b-form-group>
      <b-form-group label="Full Name" class="col-md-6 col-12">
        <b-form-input v-model="localUser.fullName"></b-form-input>
      </b-form-group>
      <b-form-group label="Department" class="col-md-6 col-12">
        <b-form-select v-model="localUser.department" :options="departmentOptions"></b-form-select>
      </b-form-group>
      <b-form-group label="Roles" class="col-12">
        <b-form-select 
          v-model="localUser.roles" 
          :options="roleOptions"
        ></b-form-select>
      </b-form-group>
      <b-button type="button" variant="secondary" @click="closeModal" class="col-md-6 col-12">Cancel</b-button>
      <b-button type="submit" variant="primary" class="col-md-6 col-12">Update User</b-button>
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
      default: () => null,
    },
  },

  emits: ['update:isVisible', 'save'],
  
  setup(props, { emit }) {
    const userStore = useUserStore();

    const localUser = ref(props.user ? { ...props.user } : {});

    const localIsVisible = ref(props.isVisible);

    watch(
      () => props.isVisible,
      (newValue) => {
        localIsVisible.value = newValue;
        if (newValue) {
          localUser.value = { ...props.user };
        }
      }
    );

    watch(
      () => props.user,
      (newUser) => {
        localUser.value = { ...newUser };
      }
    );

    const departmentOptions = ref([
      { value: null, text: '--Select--' },
      { value: 'IT', text: 'IT' },
      { value: 'HR', text: 'HR' },
      { value: 'Design', text: 'Design' },
      { value: 'Sales', text: 'Sales' },
    ]);

    const roleOptions = computed(() => userStore.roles);

    userStore.fetchRoles();

    const saveUserChanges = async () => {
      try {
        const response = await userStore.updateSelectedUser(localUser.value); 
        if (response && response.status === 'success') { 
          userStore.fetchUsers();
          emit('save', localUser.value);
          emit('update:isVisible', false);
          window.location.reload();
        } else {
          alert('Failed to update user. Please try again'); 
        }
      } catch (error) {
        console.error('Update user failed', error);
        alert('Failed to update user. Please try again');
      }
    };

    const handleHide = () => {
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
