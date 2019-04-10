<template>
  <v-app id="primary">
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
        <v-list-tile
          v-for="item in items"
          :key="item.route"
          @click="navigate(item)"
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
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <nuxt />
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      drawer: true,
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
  methods: {
    navigate(item) {
      this.$router.push({
        path: item.route
      });
    }
  }
};
</script>
