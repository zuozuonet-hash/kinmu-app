// Firestoreの全職員ドキュメントに「その他」フィールドを追加するバッチスクリプト
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrowY0boMViDLNO81ip9DDvzjB660UZ4o",
  authDomain: "okidate-winter-kimmu-kanri.firebaseapp.com",
  projectId: "okidate-winter-kimmu-kanri",
  storageBucket: "okidate-winter-kimmu-kanri.firebasestorage.app",
  messagingSenderId: "154561115575",
  appId: "1:154561115575:web:5672671fa217fffbd32432"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addFieldToAllStaff() {
  const staffSnapshot = await getDocs(collection(db, "winter-shifts"));
  for (const staffDoc of staffSnapshot.docs) {
    const staffId = staffDoc.id;
    const data = staffDoc.data();
    // 既に「その他」フィールドがある場合はスキップ
    if (data["その他"] !== undefined) continue;
    await setDoc(
      doc(db, "winter-shifts", staffId),
      { その他: "未設定" },
      { merge: true }
    );
    console.log(`追加: ${staffId}`);
  }
  console.log("全職員へのフィールド追加が完了しました。");
}

addFieldToAllStaff();
