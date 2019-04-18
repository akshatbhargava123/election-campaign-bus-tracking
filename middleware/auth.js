import firebase from 'firebase';

export default function({ redirect }) {
  return new Promise((resolve) => {
    const unsubscibe = firebase.auth().onAuthStateChanged(user => {
      unsubscibe();
      if (user && user.uid) resolve(true);
      else redirect('/login');
    });
  });
};
