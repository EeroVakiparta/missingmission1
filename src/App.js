import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { initializeApp } from 'firebase/app';
const firebaseConfig = {

};
const app = initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
//const analytics = firebase.analytics();

// user is an object when signed in and out = null
// Logged in show chat logged out show sign in

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>CC Chat</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
    .catch((error) => alert(error.message));
  };

  const signInWithErkka = () => {
    firebase.auth().signInAnonymously()
    .then(() => {
    // Signed in..
    //console.log("erkka loggas prkl, erkan implementointi kesti 5x kauemmi ku koko muu koodi.");
  })
  .catch((error) => {
    // eslint-disable-next-line
    var errorCode = error.code;
    // eslint-disable-next-line
    var errorMessage = error.message;
  });
    

  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <br></br>
      <button className="sign-in" onClick={signInWithErkka}>
        Olen Erkka
      </button>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        SignOut
      </button>
    )  );
}

function ChatRoom() {
  // helps with scrolling messages
  // TODO: scroll at start of app
  const dummy = useRef();
  //refere firestore collection
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "desc").limit(10);

  //listen data with hook
  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    //prevent refresh
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    //create new document in firestore
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages
            .slice(0)
            .reverse()
            .map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="write here..."
        />

        <button type="submit" disabled={!formValue}>
        🐑
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const erkkaUrl = "https://i.ibb.co/W6scTkn/elmjolk-removebg-preview.png";
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  //console.log(photoURL);
  let chatImage;
  if(auth.currentUser.isAnonymous) {
    //console.log("erkka loggas prkl, erkan implementointi kesti 5x kauemmi ku koko muu koodi.");
    chatImage = erkkaUrl;
  }else{
    // eslint-disable-next-line
    chatImage = photoURL;
  }

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img alt="Erkka" src={chatImage} />
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
