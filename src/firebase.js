import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCohD8e3EjQpk1-IFDuOLbovhNIadGyDBM",
    authDomain: "instagram-clone-b5de1.firebaseapp.com",
    databaseURL: "https://instagram-clone-b5de1.firebaseio.com",
    projectId: "instagram-clone-b5de1",
    storageBucket: "instagram-clone-b5de1.appspot.com",
    messagingSenderId: "1091112992110",
    appId: "1:1091112992110:web:7321bf98f82493425ad57f",
    measurementId: "G-FF7BKECQB8"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore()
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }