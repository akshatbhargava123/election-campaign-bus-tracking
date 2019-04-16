<template>
  <v-snackbar v-model="show" :color="errorSnack ? 'error' : ''">
    {{message}}
    <v-btn flat dark @click.native="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  created: function() {
    this.$store.watch(
      state => state.snackbar.snack,
      () => {
        const msg = this.$store.state.snackbar.snack;
        const errorSnack = this.$store.state.snackbar.errorSnack;
        if (msg !== '') {
          this.show = true;
          this.message = msg;
          this.errorSnack = errorSnack;
          this.$store.commit('snackbar/reset');
        }
      }
    );
  },
  data() {
    return {
      show: false,
      message: '',
      errorSnack: false,
    };
  }
};
</script>