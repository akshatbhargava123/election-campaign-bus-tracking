<template>
  <v-app>
    <Snackbar />
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-toolbar color="indigo" dark>
        <v-toolbar-title>Welcome Admin</v-toolbar-title>
      </v-toolbar>
      <v-list>
        <v-list-tile
          v-for="item in items"
          :key="item.route"
          :to="item.route"
          active-class="highlighted"
          :class="item.path === $route.path ? 'highlighted' : ''"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-spacer></v-spacer>
        <v-list-tile @click.native="logout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Driver Tracking System</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>
<script>
import Snackbar from '@/components/Snackbar.vue';
export default {
  components: { Snackbar },
  data() {
    return {
      drawer: false,
      items: [
        {
          title: 'Add Driver',
          icon: 'person_add',
          route: '/add-driver'
        },
        {
          title: 'Track Drivers',
          icon: 'directions_bus',
          route: 'track-drivers'
        }
      ]
    };
  },
  mounted() {
    setTimeout(() => {
      this.drawer = true;
    }, 500);
  },
  methods: {
    navigate(item) {
      this.$router.push({
        path: item.route
      });
    },
    logout() {
      this.$store.dispatch('auth/logout')
        .then(() => {
          this.$router.replace('/login');
        });
    }
  }
};
</script>
<style>
.highlighted {
  background: lightgrey;
}
</style>
