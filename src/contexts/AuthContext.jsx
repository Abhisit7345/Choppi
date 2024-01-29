import React, { useContext, useState } from "react";
import { auth, provider } from "../firebase.js";
import { useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { db } from "../firebase.js";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const AuthContext = React.createContext();
const userRef = collection(db, "users");

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [createUserError, setCreateUserError] = useState("");
  const [loading, setLoading] = useState(true);
  const [signinUserError, setSigninUserError] = useState("");

  async function signinUsingGoogle() {
    await signInWithPopup(auth, provider)
      .then((result) => {
        const queryUser = query(userRef, where("uid", "==", result.user.uid));
        getDocs(queryUser)
        .then((querySnapshot)=> {
          console.log(querySnapshot.docs.length)
          if(querySnapshot.docs.length == 0){
              try {
                const docRef = addDoc(userRef, {
                  uid: result.user.uid,
                  pictureUrl: import.meta.env.VITE_DEFAULT_PFP,
                  name: result.user.displayName,
                  email: result.user.email,
                });
              } catch (e) {
                console.log(e);
              }
          }
        })
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        console.log(error)
      });
  }

  function signup(email, password, name) {
    return createUserWithEmailAndPassword(auth, email, password, name = name)
      .then((userCredential) => {
        const queryUser = query(userRef, where("uid", "==", userCredential.user.uid));
        getDocs(queryUser)
        .then((querySnapshot)=> {
          console.log(querySnapshot.docs.length)
          if(querySnapshot.docs.length == 0){
              try {
                const docRef = addDoc(userRef, {
                  uid: userCredential.user.uid,
                  pictureUrl: import.meta.env.VITE_DEFAULT_PFP,
                  name: name,
                  email: userCredential.user.email
                });
              } catch (e) {
                console.log(e);
              }
          }
        })
      })
      .catch((error) => {
        let errorCode = error.code;
        errorCode = errorCode.replaceAll("auth/", "");
        errorCode = errorCode.replaceAll("-", " ");
        errorCode = errorCode.charAt(0).toUpperCase() + errorCode.slice(1);
        return errorCode;
      });
  }

  function signin(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return { uid: userCredential.user.uid };
        // ...
      })
      .catch((error) => {
        let errorCode = error.code;
        errorCode = errorCode.replaceAll("auth/", "");
        errorCode = errorCode.replaceAll("-", " ");
        errorCode = errorCode.charAt(0).toUpperCase() + errorCode.slice(1);
        return errorCode;
      });
  }

  function signout() {
    return signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    auth,
    currentUser,
    signup,
    signin,
    createUserError,
    signout,
    setCreateUserError,
    signinUserError,
    setSigninUserError,
    signinUsingGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
