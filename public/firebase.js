import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase 設定 (プロジェクトの実際の値)
const firebaseConfig = {
  apiKey: "AIzaSyBrowY0boMViDLNO81ip9DDvzjB660UZ4o",
  authDomain: "okidate-winter-kimmu-kanri.firebaseapp.com",
  projectId: "okidate-winter-kimmu-kanri",
  storageBucket: "okidate-winter-kimmu-kanri.firebasestorage.app",
  messagingSenderId: "154561115575",
  appId: "1:154561115575:web:5672671fa217fffbd32432"
};

console.log("🔥 Firebase 初期化中...");
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
console.log("✅ Firebase 初期化完了");
