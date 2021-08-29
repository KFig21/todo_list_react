import Firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyDVlZXnXnixXDc8gOkFDPXUxm_uDNzdGmY",
  authDomain: "to-do-list-react-28aa6.firebaseapp.com",
  projectId: "to-do-list-react-28aa6",
  storageBucket: "to-do-list-react-28aa6.appspot.com",
  messagingSenderId: "841622654738",
  appId: "1:841622654738:web:0499c6422190e1b2a92dcb",
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;
const db = firebase.firestore();

export { firebase, FieldValue };
export default db;
