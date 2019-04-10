<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <v-progress-circular indeterminate></v-progress-circular>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  created() {
    this.$router.push({
      path: 'add-driver'
    });
  }
};
</script>
