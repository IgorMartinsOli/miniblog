import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAWuRADm5kRwGuuBAaI1MRvl4B5QnXXQUM",
    authDomain: "miniblog-31b21.firebaseapp.com",
    projectId: "miniblog-31b21",
    storageBucket: "miniblog-31b21.appspot.com",
    messagingSenderId: "716712109322",
    appId: "1:716712109322:web:d53f9ba04b78c3caa706f3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db};