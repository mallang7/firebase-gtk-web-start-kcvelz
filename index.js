// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

var rsvpListener = null;
var guestbookListener = null;

async function main() {

  var firebaseConfig = {
    apiKey: "AIzaSyDxsAwpKvPyt5y8pj1LAslem0_22tx-60c",
    authDomain: "firbase-web-codelab-56f97.firebaseapp.com",
    databaseURL: "https://firbase-web-codelab-56f97.firebaseio.com",
    projectId: "firbase-web-codelab-56f97",
    storageBucket: "firbase-web-codelab-56f97.appspot.com",
    messagingSenderId: "1025638126768",
    appId: "1:1025638126768:web:8289decfccc9dad0a19775",
    measurementId: "G-72NFQ3GE8F"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();
  // firebase.initializeApp(firebaseConfig);

  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  };

  const ui = new firebaseui.auth.AuthUI(firebase.auth());


// Listen to RSVP button clicks
startRsvpButton.addEventListener("click",
() => {
  if(firebase.auth().currentUser){
    //if a user has signed in, clicking this button will allow the user to sign out
    firebase.auth().signOut();
  }
  else{
    ui.start("#firebaseui-auth-container", uiConfig);
  }
  });

firebase.auth().onAuthStateChanged((user)=> {
  if(user){
    startRsvpButton.textContent="LOGOUT";
    guestbookContainer.style.display = "block";
    subscribeGuestbook();
  }
  else{
    startRsvpButton.textContent="RSVP";
    guestbookContainer.style.display = "none";
    unsubscribeGuestbook();
  }
})
// Listen to the form submission
form.addEventListener("submit", (e) => {
   // Prevent the default form redirect
   e.preventDefault();
   // Write a new message to the database collection "guestbook"
   firebase.firestore().collection("guestbook").add({
      text: input.value,
      timestamp: Date.now(),
      name: firebase.auth().currentUser.displayName,
      userId: firebase.auth().currentUser.uid
     })
      // clear message input field
     input.value = ""; 
      // Return false to avoid redirect
     return false;
     });

     function subscribeGuestbook(){
          // Create query for messages
        guestbookListener = firebase.firestore().collection("guestbook").orderBy("timestamp","desc").onSnapshot((snaps) => {
            // Reset page
            guestbook.innerHTML = "";
            // Loop through documents in database
           snaps.forEach((doc) => {
                 // Create an HTML entry for each document and add it to the chat
                 const entry = document.createElement("p");     entry.textContent = doc.data().name + ": " + doc.data().text;
                 guestbook.appendChild(entry);
               });
             });
            };






     firebase.firestore().collection("guestbook").orderBy("timestamp","desc").onSnapshot((snaps) => {
        // Reset page
        guestbook.innerHTML = "";
        // Loop through documents in database
        snaps.forEach((doc) => {
            // Create an HTML entry for each document and add it to the chat
           const entry = document.createElement("p");  entry.textContent = doc.data().name + ": " + doc.data().text;
             guestbook.appendChild(entry);
           });
          });

function unsubscribeGuestbook(){
   if (guestbookListener != null)
   {
       guestbookListener();
       guestbookListener = null;
     }};

rsvpYes.onclick = () => {
  const userDoc = firebase.firestore().collection('attendees').doc(firebase.auth().currentUser.uid);
   // If they RSVP'd yes, save a document with attending: true
   userDoc.set({
       attending: true }).catch(console.error)
}
rsvpNo.onclick = () => {
  const userDoc = firebase.firestore().collection('attendees').doc(firebase.auth().currentUser.uid);
   // If they RSVP'd no, save a document with attending: false
   userDoc.set({
       attending: false
     }).catch(console.error)
}
}
main();

