<!-- src/components/account/LoginPage.vue -->
<template>
  <b-modal id="login-modal" title="Login" v-model="isLoginModalVisible">
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

<script>
export default {
  props: {
    isLoginModalVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    handleLogin() {
      // Handle login logic here
      console.log('Logging in with', this.email, this.password);
      this.$emit('update:isLoginModalVisible', false); // Close modal after login
    }
  }
};
</script>

<style>
/* Add any custom styles here */
</style>
