<template>
  <b-modal 
    v-model="deleteModalShow" 
    title="Delete Role" 
    hide-footer
    centered
    @hide="closeModal"
  >
    <div class="text-center">
      <div class="icon-warning"><i class="ri-error-warning-line"></i></div>
      <b>Are you sure you want to delete "{{ role?.name }}" role?</b>
      <p>You won't be able to revert this!</p>
    </div>
    <div class="text-center">
      <b-button variant="danger" @click="submitDeleteRole">Delete</b-button>
      <b-button variant="secondary" @click="closeModal">Cancel</b-button>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Role, useRoleStore } from '@/store/roleStore';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DeleteRoleModal',
  props: {
    deleteModalShow: {
      type: Boolean,
      required: false,
    },
    role: {
      type: Object as () => Role,
      required: true,
    },
  },
  emits: ['update:deleteModalShow', 'roleDeleted'],
  setup(props, { emit }) {
    const roleStore = useRoleStore();
    const deleteModalShow = ref(false);

    const closeModal = () => {
      console.log(deleteModalShow.value, 'closeModal hit');
      emit('update:deleteModalShow', false);
      deleteModalShow.value = false;
    };

    const submitDeleteRole = async () => {
      if (props.role) {
        const response = await roleStore.deleteRole(props.role.id);
        if (response.status === 'success') {
          emit('update:deleteModalShow', false);
          closeModal();
        }
      }
    };

    return { 
      deleteModalShow,
      closeModal, 
      submitDeleteRole 
    };
  },
});
</script>
