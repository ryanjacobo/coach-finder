import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyCLw2HZiWeAY-AwPWNDi24sVCBPylHs4eA",
  authDomain: "vuex-projects-6691d.firebaseapp.com",
  projectId: "vuex-projects-6691d",
  storageBucket: "vuex-projects-6691d.appspot.com",
  messagingSenderId: "900349221764",
  appId: "1:900349221764:web:3af7ffe5f3f6f5d9a79bd1",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();

export { projectFirestore };
