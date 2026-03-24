// Import Firebase (CDN version for browser)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5JzFE2YZQ_WdOv4Ikd3g9Wy6zkkuIZ0o",
  authDomain: "recycleraja1.firebaseapp.com",
  projectId: "recycleraja1",
  storageBucket: "recycleraja1.firebasestorage.app",
  messagingSenderId: "720479746925",
  appId: "1:720479746925:web:7c97e495e8f98c41307864"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export database
export { db };