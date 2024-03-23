import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";
const firebaseConfig = {
  apiKey: "AIzaSyDmTbDHOz6OQ2KZRrKtHli9qDYer644FJM",
  authDomain: "find-x-ai.firebaseapp.com",
  projectId: "find-x-ai",
  storageBucket: "find-x-ai.appspot.com",
  messagingSenderId: "499251660290",
  appId: "1:499251660290:web:1f8964b7a0701c4b68891b",
  measurementId: "G-J34FY7M91D",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1000 milliseconds (1 second)

    const res = await signInWithPopup(auth, googleProvider);
    console.log(res);
    return {
      status: true,
      message: "logged in successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      message: "failed to sign in",
    };
  }
};

export const getUserState = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1000 milliseconds (1 second)
  try {
    const user = auth.currentUser;
    console.log(user)
  } catch (error) {
    console.log(error)
  }
  
  // console.log("state is",user)
  // if (user) {
  //   return {
  //     status: true,
  //     message: "user logged in",
  //     data: user,
  //   };
  // } else {
  //   return {
  //     status: false,
  //     message: "user not logged in",
  //   };
  // }
};
