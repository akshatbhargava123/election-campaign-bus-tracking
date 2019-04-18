<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Welcome, login to continue.</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              prepend-icon="person"
              name="login"
              label="Registered Email"
              type="text"
              v-model="user.email"
            ></v-text-field>
            <v-text-field
              prepend-icon="lock"
              name="password"
              label="Password"
              type="password"
              v-model="user.password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <!-- <v-spacer></v-spacer> -->
          <v-btn color="primary" block @click.native="login">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Login',
  layout: 'default',
  data: () => ({
    user: {
      email: '',
      password: '',
    },
  }),
  created() {
    if (this.$store.state.auth.user) {
      this.$router.replace({
        path: '/'
      });
    }
  },
  methods: {
    login() {
      this.$store.dispatch('auth/login', this.user).then(uid => {
        if (uid) {
          this.$router.push({
            path: 'add-driver'
          });
        }
      });
    }
  }
}
</script>

<style>

</style>
