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
      <b-table :items="mappedActivities" :fields="fields" striped hover>
        <template #cell(action)="data">
          <!-- {{ data.item.blocked }} -->
          <b-button squared variant="outline-danger" v-if="data.item.blocked === 'Active'" @click="openRevokeModal(data.item)">Revoke</b-button>
        </template>
      </b-table>
    </div>

    <!-- Modal Revoke -->
    <b-modal
      v-model="isRevokeModalVisible"
      ok-variant="danger" 
      hide-footer
      centered 
      @hide="handleRevokeModalHide"
    >
      <div class="text-center">
        <div class="icon-warning"><i class="ri-error-warning-line"></i></div>
        <b>Are you sure want revoke selected token?</b>
        <p>You won't be able to revert this!</p>
      </div>
      <div class="text-center">
        <b-button variant="danger" @click="confirmRevokeUserId">Yes, revoke it!</b-button>
        <b-button @click="handleRevokeModalHide">Cancel</b-button>
      </div>
    </b-modal>

  </b-modal>
</template>

<script lang="ts">
import { useUserStore } from '@/store/userStore';
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
    user: {
      type: Object,
      default: () => null,
    },
  },
  setup(props, { emit }) {
    const userStore = useUserStore();

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
            signInAtRaw: item.SignedInAt,
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
          }))
        : [];
    });

    // Revoke
    const isRevokeModalVisible = ref(false);
    const selectedActivity = ref(null);

    const openRevokeModal = (item) => {
      selectedActivity.value = item;
      isRevokeModalVisible.value = true;
    };

    const handleRevokeModalHide = () => {
      isRevokeModalVisible.value = false;
      selectedActivity.value = null;
    };

    const confirmRevokeUserId = () => {
      if (selectedActivity.value && props.user) {
        const userId = props.user?.id;
        const signedInAt = selectedActivity.value.signInAtRaw;

        userStore.revokeUser(userId, signedInAt);
        handleRevokeModalHide();
      }
    };

    // Hide Modal
    const handleHide = () => {
      emit('update:isVisible', false);
    };

    return {
      fields,
      mappedActivities,
      handleHide,
      openRevokeModal,
      handleRevokeModalHide,
      confirmRevokeUserId,
      isRevokeModalVisible,
      selectedActivity,
      userStore,
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
