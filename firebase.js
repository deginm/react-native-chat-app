import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD5zeCcfqf-jOuwLw8FAtU5QvaC1iMnB0c",
    authDomain: "signal-clone-54f19.firebaseapp.com",
    projectId: "signal-clone-54f19",
    storageBucket: "signal-clone-54f19.appspot.com",
    messagingSenderId: "810328813581",
    appId: "1:810328813581:web:321c6bd4fca6a12f27a544"
};

// Initialize Firebase
let app
if (firebase.apps.length == 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };