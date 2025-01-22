import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBKDs8-IEuu-d9vl2-qqzs5o6KnOilauE4",
    authDomain: "curso-50158.firebaseapp.com",
    projectId: "curso-50158",
    storageBucket: "curso-50158.firebasestorage.app",
    messagingSenderId: "96357475704",
    appId: "1:96357475704:web:7f602e57656132217d548d",
    measurementId: "G-271GYJ37RF"
};

const firebaApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaApp);

export {db};