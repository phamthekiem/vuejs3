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

    // Tạo bản sao của user từ props khi modal được mở
    const localUser = ref({ ...props.user });

    // Theo dõi sự thay đổi của isVisible để cập nhật lại dữ liệu localUser
    watch(
      () => props.isVisible,
      (newValue) => {
        if (newValue) {
          // Khi modal mở, cập nhật lại dữ liệu từ props.user
          localUser.value = { ...props.user };
        }
      }
    );

    // Theo dõi props.user và cập nhật localUser mỗi khi props.user thay đổi
    watch(
      () => props.user,
      (newUser) => {
        localUser.value = { ...newUser }; // Gán lại dữ liệu user vào localUser
      },
      { immediate: true } // Kích hoạt watcher ngay lập tức để nhận dữ liệu ban đầu
    );

    const departmentOptions = ref([
      { value: null, text: '--Select--' },
      { value: 'CEO', text: 'CEO' },
      { value: 'DEV', text: 'DEV' },
      { value: 'Design', text: 'Design' },
      { value: 'Sale', text: 'Sale' },
    ]);

    const roleOptions = computed(() => userStore.roles);

    // Gọi fetchRoles một lần khi component được khởi tạo
    userStore.fetchRoles();

    const saveUserChanges = async () => {
      console.log('User information before update:', localUser.value);

      try {
        const response = await userStore.updateUser(localUser.value.id, localUser.value);
        if (response && response.success) {
          userStore.fetchUsers();
          emit('save', localUser.value); // Trả về user đã được chỉnh sửa
          emit('update:isVisible', false);
          alert('User updated successfully!');
        }
      } catch (error) {
        console.error('Update user failed', error);
        alert('Failed to update user. Please try again');
      }
    };

    const handleHide = () => {
      // Reset lại localUser mỗi khi modal bị ẩn
      localUser.value = { ...props.user };
      emit('update:isVisible', false);
    };

    const closeModal = () => {
      handleHide();
    };

    return {
      localUser,
      saveUserChanges,
      handleHide,
      closeModal,
      departmentOptions,
      roleOptions,
    };
  },
});
</script>
