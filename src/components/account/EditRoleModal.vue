<template>
  <RoleModal 
    :modelValue="internalShow" 
    :role="role" 
    :modalTitle="'Edit Role'" 
    :submitButtonText="'Update'" 
    :isEditMode="true"
    @update:modelValue="close"
  />
</template>

<script lang="ts">
import { Role, useRoleStore } from '@/store/roleStore';
import { defineComponent, ref } from 'vue';
import RoleModal from './RoleModal.vue';

export default defineComponent({
  name: 'EditRoleModal',
  components: { RoleModal },
  props: {
    role: {
      type: Object as () => Role,
      required: true
    }
  },
  setup(props) {
    const roleStore = useRoleStore();
    const internalShow = ref(false);

    const close = () => {
      internalShow.value = false;
    };

    return { internalShow, close };
  }
});
</script>
