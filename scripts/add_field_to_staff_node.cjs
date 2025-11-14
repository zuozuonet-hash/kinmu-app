// scripts/add_field_to_staff_node.cjs
const admin = require("firebase-admin");

// サービスアカウントキーのパス（Firebaseコンソールからダウンロードしたjsonファイル）
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addFieldToAllStaff() {
  const staffSnapshot = await db.collection("winter-shifts").get();
  for (const staffDoc of staffSnapshot.docs) {
    const staffId = staffDoc.id;
    const data = staffDoc.data();
    if (data["その他"] !== undefined) continue;
    await db.collection("winter-shifts").doc(staffId).set(
      { その他: "未設定" },
      { merge: true }
    );
    console.log(`追加: ${staffId}`);
  }
  console.log("全職員へのフィールド追加が完了しました。");
}

addFieldToAllStaff();
