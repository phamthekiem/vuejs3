<!-- src/pages/index.vue -->
<template>
  <div>
    <h1>Dashboards</h1>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Brand</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-button variant="primary" @click="showLoginModal">Login</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <LoginPage :isLoginModalVisible="isLoginModalVisible" @update:isLoginModalVisible="isLoginModalVisible = $event" />
  </div>
</template>

<script lang="ts">
import LoginPage from '@/components/account/LoginPage.vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
    LoginPage
  },
  setup() {
    const isLoginModalVisible = ref(false);

    const showLoginModal = () => {
      isLoginModalVisible.value = true; // Mở modal
    };

    return {
      isLoginModalVisible,
      showLoginModal
    };
  }
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
