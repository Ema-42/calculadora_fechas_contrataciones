import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

let firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
let firebaseAuthDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
let firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
let firebaseStorageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
let firebaseMessagingSenderId =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
let firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

let firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

console.log("Firebase auth instance:", auth);

export const googleProvider = new GoogleAuthProvider();
