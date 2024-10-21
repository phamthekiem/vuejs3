<template>
  <div>
    <h1>Dashboards</h1>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">Brand</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-button variant="primary" @click="navigateToLogin">Login</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

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

    const navigateToLogin = () => { 
      router.push('/login');
    };

    return {
      isLoginModalVisible,
      navigateToLogin 
    };
  }
});
</script>
