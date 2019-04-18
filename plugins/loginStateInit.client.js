import firebase from 'firebase';

export default ({ store, redirect }) => {
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  firebase.auth().onAuthStateChanged(user => {
    if (user && user.uid) {
      store.commit('auth/setUser', user.uid);
    }
  });
};
