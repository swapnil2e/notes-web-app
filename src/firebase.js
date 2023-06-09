import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const app = firebase.initializeApp({
    // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.REACT_APP_FIREBASE_APP_ID
     apiKey: "AIzaSyDrJ2OdmkaLcI0ml3rox2sbrS0MhJmwK5M",
  authDomain: "notes-1c7b9.firebaseapp.com",
  projectId: "notes-1c7b9",
  storageBucket: "notes-1c7b9.appspot.com",
  messagingSenderId: "232218970720",
  appId: "1:232218970720:web:9bdd010e46174c748bd105"
})

export const auth = app.auth()
const googleProvider = new firebase.auth.GoogleAuthProvider()
export const signInWithGoogle = () => {
    auth.signInWithPopup(googleProvider)
        .then()
        .catch((error)=> console.log(error))
}
export const firestore = app.firestore()
export const database = {
    users: firestore.collection('users'),
    notesM: firestore.collection('notes'),
    getCurrentTimeStamp : firebase.firestore.FieldValue.serverTimestamp
}