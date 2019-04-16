import firebase from 'firebase';

export default function({ redirect }) {
  if (!Boolean(firebase.auth().currentUser)) {
    redirect('/login');
  }
}
