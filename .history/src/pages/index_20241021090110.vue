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
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoginModalVisible: false,
      email: '',
      password: ''
    };
  },
  methods: {
    showLoginModal() {
      this.isLoginModalVisible = true;
    },
    handleLogin() {
      // Handle login logic here
      console.log('Logging in with', this.email, this.password);
      this.isLoginModalVisible = false; // Close modal after login
    }
  }
};
</script>

<style>
/* Add any custom styles here */
</style>
