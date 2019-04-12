import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBHsrco14tiXq9Zg3Qj_CLRO8jdhF4LS6A",
    authDomain: "bus-tracking-patham.firebaseapp.com",
    databaseURL: "https://bus-tracking-patham.firebaseio.com",
    projectId: "bus-tracking-patham",
    storageBucket: "bus-tracking-patham.appspot.com",
    messagingSenderId: "505406556474"
  });
}
