import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

// user is an object when signed in and out = null
// Logged in show chat logged out show sign in
const [user] = useAuthState(auth);

function App() {
  return (
    <div className="App">
      <header></header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

export default App;
