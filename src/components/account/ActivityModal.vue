<template>
  <b-modal
    :visible="isVisible"
    title="Activities"
    hide-footer
    centered
    dialog-class="modal-full-width"
    size="xl"
    @hide="handleHide" 
  >
    <div>
      {{ user?.id }}
      <b-table :items="activities" :fields="fields" striped hover></b-table>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { useUserStore } from '@/store/userStore';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'ActivityModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const userStore = useUserStore();
    const activities = ref([]);
    const fields = [
    { key: 'signInAt', label: 'Sign In At' },
    { key: 'expiresAt', label: 'Expires At' },
    { key: 'ip', label: 'IP' },
    { key: 'blocked', label: 'Blocked' },
    { key: 'userAgent', label: 'User Agent' },
    ];

    const handleHide = () => {
      emit('update:isVisible', false);
      activities.value = [];
      // window.location.reload();
    };

    onMounted(async () => {
      const userId = props.user?.id;

      if (userId) {
        try {
          const response = await userStore.fetchActivities(userId);

          if (response && response.success) {
            const parsedData = JSON.parse(response.data);
            activities.value = parsedData.map(activity => ({
              ip: activity.IpAddress,
              userAgent: activity.UserAgent,
              signInAt: new Date(activity.SignedInAt * 1000).toLocaleString(),
              expiresAt: new Date(activity.ExpiresAt * 1000).toLocaleString(),
              blocked: activity.Blocked ? 'Yes' : 'No',
            }));

            console.log(activities.value); // Kiểm tra giá trị
          } else {
            console.error('Failed to fetch activities:', response?.message || 'Unknown error');
          }
        } catch (error) {
          console.error('Error fetching activities:', error);
        }
      } else {
        console.warn('User ID is not available.');
      }
    });


    return {
      activities,
      fields,
      handleHide, 
    };
  },
});
</script>
