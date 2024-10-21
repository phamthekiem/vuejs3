<script setup>
import { ref } from 'vue';

const open = ref(false)
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  inline-size: 300px;
  inset-block-start: 20%;
  inset-inline-start: 50%;
  margin-inline-start: -150px;
}
</style>
