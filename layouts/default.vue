<template>
  <v-app>
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
export default {
  data() {
    return {
      drawer: false,
      items: [
        {
          title: 'Add Driver',
          icon: 'home',
          route: '/add-driver'
        },
        {
          title: 'Track Drivers',
          icon: 'home',
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
    }
  }
};
</script>
<style>
.highlighted {
  background: lightgrey;
}
</style>
