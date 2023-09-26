// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZaZsZw-4MIdsoaUJkWLzzvNOXRQwC7B4",
    authDomain: "ododevsnotes.firebaseapp.com",
    databaseURL: "https://ododevsnotes-default-rtdb.firebaseio.com",
    projectId: "ododevsnotes",
    storageBucket: "ododevsnotes.appspot.com",
    messagingSenderId: "423383404271",
    appId: "1:423383404271:web:c19f6271f0b0feee70d51a"
};

// Initiate Firebase
const app = initializeApp(firebaseConfig);
console.log("firebase initiated :D")

// Get Firebase Authentication
import { getAuth, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js"
console.log("imported firebase auth :D");
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account'
 });
const login = document.getElementById("signIn");

const signIn = async() => {
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user
        console.log("logged IN! " + user);
        window.location.replace("https://ododevsnotes.web.app");
    }).catch((error) => {
        alert(error.code + error.message);
    })
}

login.addEventListener('click', signIn)

