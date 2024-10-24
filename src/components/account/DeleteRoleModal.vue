<template>
  <b-modal v-model="show" title="Delete Role" @hide="closeModal">
    <p>Are you sure you want to delete the role "<strong>{{ role?.name }}</strong>"?</p>
    <div class="text-end">
      <b-button variant="danger" @click="submitDeleteRole">Delete</b-button>
      <b-button variant="secondary" @click="closeModal">Cancel</b-button>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Role } from '@/store/roleStore';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DeleteRoleModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    role: {
      type: Object as () => Role,
      required: true,
    },
  },
  emits: ['update:show', 'roleDeleted'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('update:show', false);
    };

    const submitDeleteRole = () => {
      // Perform delete role logic (e.g., API call)
      emit('roleDeleted', props.role);
      closeModal();
    };

    return { closeModal, submitDeleteRole };
  },
});
</script>
