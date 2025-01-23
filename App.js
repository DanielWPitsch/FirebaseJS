import { db, auth } from "./firebaseConection";
import './app.css';
import { useState, useEffect } from "react";
import { doc, deleteDoc, collection, addDoc, 
         getDocs, updateDoc, onSnapshot} from 'firebase/firestore';
import { createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, signOut,
         onAuthStateChanged } from "firebase/auth";
import RoutesApp from "./routes";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  return(
    <BrowserRouter>
      <RoutesApp/>
    </BrowserRouter>
  )
}

