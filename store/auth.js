import firebase from 'firebase';

export const state = () => ({
  user: null
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  }
};

export const actions = {
  login({ commit }, { email, password }) {
    return firebase.auth().signInWithEmailAndPassword(
      email,
      password,
    ).then(res => {
      commit('setUser', res.user.uid);
      return res.user.uid;
    }).catch(error => {
      commit('snackbar/showError', error.message, { root: true });
    });
  },
  logout({ commit }) {
    commit('setUser', null);
    return firebase.auth().signOut();
  }
}