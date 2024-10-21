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

<script>
import LoginPage from '@/components/account/LoginPage.vue';

export default {
  components: {
    LoginPage
  },
  data() {
    return {
      isLoginModalVisible: false
    };
  },
  methods: {
    showLoginModal() {
      this.isLoginModalVisible = true;
    }
  }
};
</script>

<style>
/* Add any custom styles here */
</style>
