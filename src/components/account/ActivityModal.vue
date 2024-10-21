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
      {{ activities }}
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
    { key: 'action', label: 'Action' },
    ];

    const mapDataToTable = (data: any[]) => {
      return data.map((item) => ({
        signInAt: new Date(parseInt(item.SignedInAt) * 1000).toLocaleString(), 
        expiresAt: new Date(parseInt(item.ExpiresAt) * 1000).toLocaleString(),
        ip: item.IpAddress,
        blocked: item.Blocked ? 'Yes' : 'No',
        userAgent: item.UserAgent,
        action: 'Some Action', 
      }));
    };

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
            console.log('Response Data:', response.data);
            activities.value = mapDataToTable(JSON.parse(response.data));
          } else {
            console.warn('Fetch activities response was not successful:', response);
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
