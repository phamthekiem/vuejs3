<!-- src/components/account/LoginPage.vue -->
<template>
  <b-modal id="login-modal" title="Login" :visible="isLoginModalVisible" @hide="closeModal">
    <form @submit.prevent="handleLogin">
      <b-form-group label="Email" label-for="email-input">
        <b-form-input id="email-input" v-model="email" type="email" required></b-form-input>
      </b-form-group>
      <b-form-group label="Password" label-for="password-input">
        <b-form-input id="password-input" v-model="password" type="password" required></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="success">Submit</b-button>
    </form>
  </b-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    isLoginModalVisible: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const email = ref('');
    const password = ref('');

    const handleLogin = () => {
      console.log('Logging in with', email.value, password.value);
      closeModal();
    };

    const closeModal = () => {
      emit('update:isLoginModalVisible', false);
    };

    return {
      email,
      password,
      handleLogin,
      closeModal
    };
  }
});
</script>


