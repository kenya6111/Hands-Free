let checkList={}

document.querySelectorAll(".edit-btn").forEach(editBtn => {
  editBtn.addEventListener("click", function () {
    const row = this.closest("tr"); // クリックされた行を取得
    const resultCell = row.querySelector(".editable"); // 結果のセル
    const originalValue = resultCell.textContent.trim(); // 元の値を取得

    // 編集フィールドを作成
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.classList.add("form-control");
    inputField.value = originalValue==='未入力'?'':originalValue;

    // 確定ボタン
    const confirmButton = document.createElement("button");
    confirmButton.classList.add("btn", "btn-dark", "btn-sm", "ms-2");
    confirmButton.textContent = "✔";

    // キャンセルボタン
    const cancelButton = document.createElement("button");
    cancelButton.classList.add("btn", "btn-light", "btn-sm", "ms-1");
    cancelButton.textContent = "✖";

    // アイコンボタンを隠す
    this.style.display = "none";

    // ボタンのコンテナ
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("d-flex", "align-items-center");
    buttonContainer.appendChild(inputField);
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);

    // セルを編集モードに
    resultCell.innerHTML = "";
    resultCell.appendChild(buttonContainer);

    // 確定ボタンの動作
    confirmButton.addEventListener("click", function () {
      const newValue = inputField.value.trim();
      resultCell.textContent = newValue || originalValue; // 空欄なら元の値に戻す
      editBtn.style.display = "inline"; // 編集ボタンを再表示
    });

    // キャンセルボタンの動作
    cancelButton.addEventListener("click", function () {
      resultCell.textContent = originalValue; // 元の値に戻す
      editBtn.style.display = "inline"; // 編集ボタンを再表示
    });
  });
});

// セッションストレージキー
const SESSION_KEY = "inspectionResults";
// sessionから復元
function loadFromSession() {
  const checkListJson = sessionStorage.getItem(SESSION_KEY)
  checkList = JSON.parse(checkListJson)
  for(let i =0; i<Object.keys(checkList).length; i++){
    const inputValue = checkList[i].value
    if(inputValue){
      document.getElementById(`inspection-input-${i+1}`).innerHTML=inputValue
      document.getElementById(`inspection-status-${i+1}`).innerHTML+='<span><i class="bi bi-check2-circle fs-3 me-2 text-complete"></i></span>'
      document.getElementById(`inspection-status-${i+1}`).innerHTML+='完了'
    }else{
      document.getElementById(`inspection-input-${i+1}`).innerHTML='未入力'
      document.getElementById(`inspection-status-${i+1}`).innerHTML+='<span><i class="bi bi-exclamation-circle fs-3 me-2 text-warning"></i></span>'
      document.getElementById(`inspection-status-${i+1}`).innerHTML+='未入力'
    }
  }
}

document.getElementById("complete").addEventListener('click',()=>{
  // 結果画面の検査結果を再読み取り
  for(let i =0; i<Object.keys(checkList).length; i++){
    const inputValue = document.getElementById(`inspection-input-${i+1}`).innerHTML
    checkList[i].value = inputValue
  }

  // 読み取り結果をDBに保存
  window.sessionStorage.setItem(SESSION_KEY,JSON.stringify(checkList))

  // 親タスクのステータスを 3:完了 にする
  let taskListJson = window.sessionStorage.getItem("taskList")
  taskList = JSON.parse(taskListJson)
  taskList[checkList[0].parentId].status = "3"
  window.sessionStorage.setItem("taskList",JSON.stringify(taskList))
  // 本日のタスク一覧画面に遷移する
  window.location.href = "inspection_kind_list.html"
})
document.addEventListener("DOMContentLoaded", ()=>{
  loadFromSession()
} );