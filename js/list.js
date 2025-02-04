KIND_LIST_SESSION_KEY="taskList"
let taskList = [// status0:未着手、 1:中断中、 2:進行中, 3:完了
    {id:"0",name:"採寸検査(車両A)",status:"0",currentIndex:""},
    {id:"1",name:"採寸検査(車両B)",status:"0",currentIndex:""},
    {id:"2",name:"規定検査",status:"0",currentIndex:""},
    {id:"3",name:"法定検査",status:"0",currentIndex:""},
    {id:"4",name:"設備検査",status:"0",currentIndex:""},
    {id:"5",name:"在庫確認",status:"0",currentIndex:""},
]

// ページ読み込み時に動作
window.onload = function () {
    //alert("ページが読み込まれました。");
    loadFromSession()
    // loadFromSession()
};

// 動的に作成する際に実装
function createItem() {
    // 追加対象のitem
    const list = document.getElementById('list');
};

// リンク移動
function move(location, id) {
    taskList[id].status="2"
    saveToSession(id)
    window.location.href = location+ "?taskId=" + id;;
};

function saveToSession(id){
    window.sessionStorage.setItem(KIND_LIST_SESSION_KEY,JSON.stringify(taskList))
    if(document.getElementById(`button${id+1}`).innerHTML==='再開'){
        window.sessionStorage.setItem("isInterrupted", "true");
    }
}

function loadFromSession() {
    const taskListJson = sessionStorage.getItem(KIND_LIST_SESSION_KEY)
    if(taskListJson){
        taskList = JSON.parse(taskListJson)
        // 取得したタスクIdをに紐づく検査項目についてsession値を取得し画面に反
        for(let i =0; i< taskList.length; i++){
            const button = document.getElementById(`button${i+1}`)
            if(taskList[i].status ==='0'){
            }else if(taskList[i].status ==='1'){
                button.innerHTML = "再開"
                button.onclick = ()=>{ resumeTask('inspection_list.html',i); };
            }else if(taskList[i].status ==='2'){
            }else if(taskList[i].status ==='3'){
                button.innerHTML = "完了"
                button.disabled = true;
                button.classList.add("btn-secondary");
            }else{
            }
        }
    }
}

// `再開` ボタン押下時のみ `loadFromSession()` を呼び出す
function resumeTask(location, id) {
    console.log(`再開ボタンが押されました: taskId=${id}`);
    // loadFromSession();
    move(location, id);
}