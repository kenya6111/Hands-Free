let currentCheckIndex = 0; // 現在のチェック項目インデックス

function isNumeric(value) {
  return /^-?\d+(\.\d+)?$/.test(value);
}

// 点検項目定義
const checkList ={
  0:'検査項目A',
  1:'検査項目B',
  2:'検査項目C',
  3:'検査項目D',
  4:'検査項目E',
  5:'検査項目F',
  6:'検査項目G',
  7:'検査項目H',
  8:'検査項目I',
  9:'検査項目J',
  10:'検査項目K',
  11:'検査項目L',
  12:'検査項目M',
  13:'検査項目N',
  14:'検査項目O',
}
document.getElementById("bunbo").innerHTML = Object.keys(checkList).length

function scroll(targetId) {
  // 新しい項目を強調
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    // 画面の中央にスクロール
    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// アコーディオンを開閉する関数
function openAccordionGroup(groupId) {
  // すべての大項目のアコーディオンを閉じる
  document.querySelectorAll(".accordion-collapse").forEach((item) => {
    let bsCollapse = new bootstrap.Collapse(item, { toggle: false });
    bsCollapse.hide(); // 閉じる
  });

  // 指定されたアコーディオンを開く
  let targetAccordion = document.getElementById(groupId);
  let bsCollapse = new bootstrap.Collapse(targetAccordion, { toggle: false });
  bsCollapse.show();
}

// 音声を読み上げる関数
async function say (text) {
  return new Promise((resolve) => {
    const play_option = new SpeechSynthesisUtterance()
    play_option.text = text
    play_option.lang = 'ja-JP';
    play_option.pitch = 1.2; // ピッチ (0 ～ 2, 通常 1.0)
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.name.includes("O-Ren"));

    if (selectedVoice) {
      play_option.voice = selectedVoice;
    }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    window.speechSynthesis.speak(play_option)
    // 読み上げ完了時に実行する処理
    play_option.onend = () => {
      console.log('読み上げが完了しました。');
      resolve()
    };
  })
}


// 音声認識インスタンス作成
const createRecognition = (onResultCallback) => {
  const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.lang = 'ja-JP'
  recognition.continuous=true
  recognition.onresult = onResultCallback;

  recognition.error = (event) => console.log('エラーが発生しました。', event.error)
  recognition.onaudiostart = () => console.log('録音が開始されました。')
  recognition.onend = () => console.log('音声認識が終了しました!')
  recognition.onnomatch = () => console.log('認識できませんでした。')
  return recognition;
}

// メイン音声認識
const recognition = createRecognition((event) => {
  console.log("-----onresult-----")
  for (let i = event.resultIndex; i < event.results.length; i++) {
    let transcript = event.results[i][0].transcript;
    console.log("📢 認識結果: " + transcript);

    if(isNumeric(transcript)){
      document.getElementById(`inspection-input-${currentCheckIndex+1}`).value = transcript // 音声入力値を現在の項目に反映し表示
      // say(transcript)
      stopRecognition()
      .then(() => say(`${transcript} `)) // 数値入力時のみ復唱
      .then(() => setTimeout(() => recognition.start(), 300)); // 1秒後に音声認識を再開
    }

    if(transcript.includes('次')){
      console.log("^^^^次の項目へ^^^^")
      stopRecognition().then(nextCheck)
    }
    if(transcript.includes('NG')){
      console.log("^^^^問題点の報告へ^^^^")
      recognition.stop()
      // 読み上げ開始
      say("問題点の報告をしてください",()=>{
        console.log('音声認識を開始します')
        recognition.stop()
        recognition2.start()
      })

    }

  }
  console.log(event)
})

// 問題報告音声認識
const recognition2 = createRecognition((event) => {
  console.log("-----onresult2-----")

  for (let i = event.resultIndex; i < event.results.length; i++) {
    let transcript = event.results[i][0].transcript;
    console.log(event.results[i].isFinal)
    if(transcript.includes('完了')){
      console.log("^^^^問題点報告完了^^^^")
      recognition2.stop()
      currentCheckIndex++;
      if(currentCheckIndex < Object.keys(checkList).length){
        checkStart()
      }else{
        console.log('すべての点検が完了しました')
        say('すべての点検が完了しました',{})
      }
    }
  }
  console.log(event)
})

function stopRecognition(){
  return new Promise(function(resolve, reject){
    if(recognition){
      recognition.stop()
      recognition.onend = function (){
        console.log("🎤 音声認識が完全に停止しました");
        resolve()
      }
    }else{
      resolve()
    }

  })
}

// 🔹 次の点検項目へ進む
function nextCheck() {
  document.getElementById(`inspection${currentCheckIndex + 1}`).classList.remove("border-danger");

  currentCheckIndex++;
  if (currentCheckIndex < Object.keys(checkList).length) {
    document.getElementById("bunsi").innerHTML = currentCheckIndex
    let progressPercent = Math.round((currentCheckIndex / Object.keys(checkList).length) * 100);
    document.getElementById("parsent").innerHTML = progressPercent;
    document.getElementsByClassName("progress-bar")[0].style.width = `${progressPercent}%`;

    // **アコーディオンを開閉する**
    if (currentCheckIndex < 5) {
      openAccordionGroup("collapseGroupOne"); // 大項目Aを開く
    } else if (currentCheckIndex < 10) {
      openAccordionGroup("panelsStayOpen-collapseTwo"); // 大項目Bを開く
    } else {
      openAccordionGroup("panelsStayOpen-collapseThree"); // 大項目Cを開く
    }

    checkStart();
  } else {
    console.log("🎉 すべての点検が完了しました");
    say("すべての点検が完了しました");
  }
}
// ここからロジック実装
function checkStart(){
  if (currentCheckIndex < Object.keys(checkList).length) {
    const currentItem = checkList[currentCheckIndex];
    console.log(`###${currentItem}を開始します###`)
    // say(`${currentItem}`,()=>{
    //   recognition.start()
    // });
    say(`${currentItem}`)
    .then(()=>{
      document.getElementById(`inspection${currentCheckIndex + 1}`).classList.add("border-danger");
      scroll(`inspection${currentCheckIndex + 1}`);
      recognition.start();
    });
  }else{
    console.log("点検完了")
  }

  }


document.getElementById("check-start").addEventListener('click',()=>{
  currentCheckIndex = 0; // 初期化
  checkStart();
})
