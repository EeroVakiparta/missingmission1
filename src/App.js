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

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with GOOGLE</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function ChatRoom() {
  //refere firestore collection
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(10);

  //listen data with hook
  const [messages] = useCollectionData(query, { idField: "id" });

  return (
    <div>
      {messages &&
        messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
    </div>
  );
}

function ChatMessage(props) {
  const { text, uid } = props.message;
  return <p>{text}</p>;
}

export default App;
