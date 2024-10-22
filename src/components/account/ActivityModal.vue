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
      <b-table :items="mappedActivities" :fields="fields" striped hover></b-table>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'ActivityModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    activities: {
      type: Object, 
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const fields = [
      { key: 'signInAt', label: 'Sign In At' },
      { key: 'expiresAt', label: 'Expires At' },
      { key: 'ip', label: 'IP' },
      { key: 'blocked', label: 'Blocked' },
      { key: 'userAgent', label: 'User Agent' },
      { key: 'action', label: 'Action' },
    ];

    const parsedActivities = computed(() => {
      let data = [];

      if (props.activities && props.activities.data) {
        try {
          data = JSON.parse(props.activities.data);
        } catch (error) {
          console.error('Error parsing activities JSON:', error);
        }
      }
      return data;
    });

    const mappedActivities = computed(() => {
      return Array.isArray(parsedActivities.value)
        ? parsedActivities.value.map((item: any) => ({
            signInAt: new Date(parseInt(item.SignedInAt) * 1000).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            }),
            expiresAt: new Date(parseInt(item.ExpiresAt) * 1000).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            }),

            ip: item.IpAddress,
            blocked: item.Blocked ? 'Blocked' : 'Active',
            userAgent: item.UserAgent,
            action: 'Revoke',
          }))
        : [];
    });

    const handleHide = () => {
      emit('update:isVisible', false);
    };

    return {
      fields,
      mappedActivities,
      handleHide,
    };
  },
});
</script>

<style>
@media (min-width: 1200px) {
  .modal-full-width {
    --bs-modal-width: 100%;
  }
}

</style>
