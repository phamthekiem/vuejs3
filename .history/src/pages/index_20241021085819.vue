<template>
  <div class="login-container">
    <h1>Login</h1>
    <b-form @submit.prevent="handleLogin">
      <b-form-group label="Username">
        <b-form-input v-model="username" required></b-form-input>
      </b-form-group>
      <b-form-group label="Password">
        <b-form-input type="password" v-model="password" required></b-form-input>
      </b-form-group>
      
      <b-alert v-if="errorMessage" variant="danger" show>
        {{ errorMessage }}
      </b-alert>

      <b-button type="submit" variant="primary" :disabled="loading">
        Login
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { loginUser } from '@/services/LoginService';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const loading = ref(false);
    const router = useRouter();

    const handleLogin = async () => {
      errorMessage.value = '';
      loading.value = true;

      try {
        const response = await loginUser(username.value, password.value);
        
        if (response && response.status === 'success') {
          localStorage.setItem('user', JSON.stringify(response.data));

          router.push('/home');
        }
      } catch (error) {
        errorMessage.value = error.message || 'Login failed';
      } finally {
        loading.value = false;
      }
    };

    return {
      username,
      password,
      errorMessage,
      loading,
      handleLogin,
    };
  },
});
</script>

<style scoped>
.login-container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: auto;
  max-inline-size: 400px;
}
</style>

