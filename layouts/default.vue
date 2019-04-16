<template>
  <v-app>
    <v-container fluid>
      <nuxt />
      <snackbar />
    </v-container>
  </v-app>
</template>

<script>
import Snackbar from '@/components/Snackbar.vue';
export default {
  components: { Snackbar },
};
</script>
