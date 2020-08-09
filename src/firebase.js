import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDdPeYOsCOOoL2HAbJmzcMQV-OqH5KlHKc',
  authDomain: 'instagram-clone-react-8d53c.firebaseapp.com',
  databaseURL: 'https://instagram-clone-react-8d53c.firebaseio.com',
  projectId: 'instagram-clone-react-8d53c',
  storageBucket: 'instagram-clone-react-8d53c.appspot.com',
  messagingSenderId: '568948664813',
  appId: '1:568948664813:web:6b68ed3daa31506ab3dfe4',
  measurementId: 'G-KJN7SRL8CP',
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
