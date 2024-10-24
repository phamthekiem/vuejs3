<template>
  <b-modal
    v-model="isDeleteConfirmationVisible"
    title="Confirm Deletion"
    ok-title="Yes, delete it!"
    cancel-title="Cancel"
    @ok="confirmDeleteUser"
    ok-variant="danger" 
    hide-footer
    centered 
  >
    <div class="text-center">
      <div class="icon-warning"><i class="ri-error-warning-line"></i></div>
      <b>Are you sure you want to delete "{{ selectedUser?.fullName }}" account?</b>
      <p>You won't be able to revert this!</p>
    </div>
    <div class="text-center">
      <b-button variant="danger" @click="confirmDeleteUser">Yes, delete it!</b-button>
      <b-button @click="isDeleteConfirmationVisible = false">Cancel</b-button>
    </div>
  </b-modal>
</template>
