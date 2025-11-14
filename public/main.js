// main.js
import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const saveBtn = document.getElementById("saveBtn");
const resultEl = document.getElementById("result");
const teacherInput = document.getElementById("teacherId");

// 必須要素が存在するか確認
if (!saveBtn || !resultEl || !teacherInput) {
  console.error("❌ 必須要素が見つかりません:", {
    saveBtn: !!saveBtn,
    resultEl: !!resultEl,
    teacherInput: !!teacherInput
  });
} else {
  console.log("✅ すべての必須要素が見つかりました");
  
  saveBtn.addEventListener("click", async () => {
    console.log("💾 保存ボタンがクリックされました");
    
    try {
      // 保存ボタンを無効化
      saveBtn.disabled = true;
      resultEl.textContent = "保存中...";
      resultEl.className = "result";
      
      // 職員IDの取得と検証
      const teacherId = teacherInput.value.trim();
      console.log("職員ID:", teacherId);
      
      if (!teacherId) {
        console.warn("⚠️ 職員名が入力されていません");
        resultEl.textContent = "職員名（ID）を入力してください。";
        resultEl.className = "result error";
        saveBtn.disabled = false;
        return;
      }

      const rows = document.querySelectorAll("tbody tr");
      const records = [];

      console.log(`📝 ${rows.length} 行のデータを処理中...`);

      rows.forEach((row, index) => {
        const dateCell = row.cells[0];
        const amSelect = row.querySelector("select.am");
        const pmSelect = row.querySelector("select.pm");

        if (dateCell && amSelect && pmSelect) {
          const dateText = dateCell.textContent.split("（")[0]; // 例: "2025-12-24"
          const amValue = amSelect.value;
          const pmValue = pmSelect.value;

          records.push({
            date: dateText,
            am: amValue,
            pm: pmValue,
            teacher: teacherId,
            updatedAt: serverTimestamp(),
          });
          
          console.log(`  行${index + 1}: ${dateText} - 午前:${amValue}, 午後:${pmValue}`);
        }
      });

      if (records.length === 0) {
        console.warn("⚠️ 保存するデータがありません");
        resultEl.textContent = "保存するデータがありません。";
        resultEl.className = "result error";
        saveBtn.disabled = false;
        return;
      }

      console.log(`💾 ${records.length}件のレコードを保存開始...`);
      console.log("保存先パス:", `winter-shifts/${teacherId}/records/{日付}`);

      // 職員ドキュメント自体にもフィールドを追加
      await setDoc(
          await setDoc(
            doc(db, "winter-shifts", teacherId),
            {
              name: teacherId,
              その他: "未設定",
              createdAt: serverTimestamp()
            },
            { merge: true }
          );

      // 職員ごとのサブコレクションに日付ドキュメントで上書き保存
      // パス: winter-shifts/{teacherId}/records/{dateText}
      let successCount = 0;
      for (const rec of records) {
        const docPath = `winter-shifts/${rec.teacher}/records/${rec.date}`;
        console.log(`  保存中: ${docPath}`);
        
        await setDoc(
          doc(db, "winter-shifts", rec.teacher, "records", rec.date),
          rec
        );
        successCount++;
      }

      console.log(`✅ 保存完了: ${successCount}件`);
      resultEl.textContent = `保存しました（職員：${teacherId}／${successCount}件）`;
      resultEl.className = "result success";
      
    } catch (err) {
      console.error("❌ 保存エラー:", err);
      console.error("エラー詳細:", {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      resultEl.textContent = `保存に失敗しました: ${err.message}`;
      resultEl.className = "result error";
    } finally {
      // 保存ボタンを再度有効化
      saveBtn.disabled = false;
    }
  });
  
  console.log("✅ 保存ボタンのイベントリスナーを設定しました");
}
