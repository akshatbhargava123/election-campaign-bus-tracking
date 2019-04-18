export const state = () => ({
  snack: '',
  errorSnack: false
});

export const mutations = {
  showError(state, message) {
    state.snack = message;
    state.errorSnack = true;
  },
  showSnack(state, message) {
    state.errorSnack = false;
    state.snack = message;
  },
  reset(state) {
    state.errorSnack = true;
    state.snack = '';
  }
};