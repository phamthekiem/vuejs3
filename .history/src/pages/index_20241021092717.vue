src/pages/index.vue
<template>
  <div>
    <h1>Dashboards</h1>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Brand</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item @click="navigateToHome">Home</b-nav-item>
          <b-nav-item @click="navigateToAbout">About</b-nav-item>
          <b-nav-item-dropdown text="Posts" right>
            <b-dropdown-item @click="navigateToPost1">Post 1</b-dropdown-item>
            <b-dropdown-item @click="navigateToPost2">Post 2</b-dropdown-item>
            <b-dropdown-item @click="navigateToPost3">Post 3</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item @click="navigateToContact">Contact</b-nav-item>
          <b-button variant="primary" @click="navigateToLogin">Login</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <main>
      <h2>Welcome to the Homepage</h2>
      <p>This is the main content of the homepage.</p>
    </main>

    <footer>
      <p>&copy; 2023 Your Company</p>
    </footer>
  </div>
</template>

<script lang="ts">
import LoginPage from '@/pages/login.vue';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    LoginPage
  },
  setup() {
    const router = useRouter(); 
    const isLoginModalVisible = ref(false);

    const navigateToHome = () => {
      router.push('/');
    };
    const navigateToAbout = () => {
      router.push('/about');
    };
    const navigateToPost1 = () => {
      router.push('/posts/1');
    };
    const navigateToPost2 = () => {
      router.push('/posts/2');
    };
    const navigateToPost3 = () => {
      router.push('/posts/3');
    };
    const navigateToContact = () => {
      router.push('/contact');
    };
    const navigateToLogin = () => { 
      router.push('/login');
    };

    return {
      isLoginModalVisible,
      navigateToHome,
      navigateToAbout,
      navigateToPost1,
      navigateToPost2,
      navigateToPost3,
      navigateToContact,
      navigateToLogin 
    };
  }
});
</script>
