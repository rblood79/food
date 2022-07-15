import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD4lFYlGsKryHvQUF5CT3wUdhnU_uQBVUA",
    authDomain: "army-c3fb4.firebaseapp.com",
    projectId: "army-c3fb4",
    storageBucket: "army-c3fb4.appspot.com",
    messagingSenderId: "806478232160",
    appId: "1:806478232160:web:893774803a8773caa12105",
    measurementId: "G-SX7YFMRCJZ"
}

export default firebase.initializeApp(firebaseConfig);