<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Brand</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item @click="navigateToHome">Home</b-nav-item>
          <b-nav-item>About</b-nav-item>
          <b-nav-item-dropdown text="Posts" right>
            <b-dropdown-item>Post 1</b-dropdown-item>
            <b-dropdown-item>Post 2</b-dropdown-item>
            <b-dropdown-item>Post 3</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item>Contact</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-button variant="primary" @click="navigateToLogin">Login</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <main class="mt-3">
      <h2>Homepage</h2>
    </main>
  </div>
</template>


<script lang="ts">
import LoginPage from '@/pages/login.vue';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    LoginPage,
  },
  setup() {
    const router = useRouter(); 
    const isLoginModalVisible = ref(false);

    const navigateToHome = () => {
      router.push('/');
    };

    const navigateToLogin = () => { 
      router.push('/login');
    };

    return {
      navigateToHome,
      navigateToLogin 
    };
  }
});
</script>
