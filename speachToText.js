let finalTranscript = ''; // 確定した音声入力結果
let currentCheckIndex = 0; // 現在のチェック項目インデックス
function isNumeric(value) {
  return /^-?\d+(\.\d+)?$/.test(value);
}
function highlightAndScroll(targetId) {
  // 現在の強調表示を削除
  // document.querySelectorAll(".inspection-item").forEach(item => {
  //   item.classList.remove("active");
  // });

  // 新しい項目を強調
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    // targetElement.classList.add("active");

    // 画面の中央にスクロール
    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// 音声を読み上げる関数
function say (text, callback) {
  const play_option = new SpeechSynthesisUtterance()
  let speechTxt = text
  play_option.text = speechTxt;
  play_option.lang = 'ja-JP';
  speechSynthesis.cancel();
  window.speechSynthesis.speak(play_option)
  document.getElementById(`inspection${currentCheckIndex+1}`).classList.add("border-danger");// 現在の項目を強調表示する。
   // 読み上げる項目を強調＆スクロール
   highlightAndScroll(`inspection${currentCheckIndex + 1}`);

  // 読み上げ完了時に実行する処理
  play_option.onend = () => {
    console.log('読み上げが完了しました。');
    if (callback) callback(); // コールバック関数を呼び出す
  };
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
    finalTranscript += transcript;
    console.log('finalTranscript'+finalTranscript)
    console.log('transcript: '+transcript)
    console.log(typeof transcript)
    console.log(event.results[i].isFinal)

    if(isNumeric(transcript)){
      say(transcript,()=>{console.log("アンサーバック")}) // 音声入力値を読み上げ
      document.getElementById(`inspection-input-${currentCheckIndex+1}`).value = transcript // 音声入力値を現在の項目に反映し表示
    }

    if(transcript.includes('次')){
      console.log("^^^^次の項目へ^^^^")
      recognition.stop()
      document.getElementById(`inspection${currentCheckIndex+1}`).classList.remove("border-danger"); // 現在の項目の強調表示を除去
      document.getElementById("bunsi").value = currentCheckIndex +1
      progressPercent = Math.round((currentCheckIndex/Object.keys(checkList).length) * 100)
      document.getElementById("parsent").innerHTML = progressPercent
      document.getElementsByClassName("progress-bar")[0].style.width = `${progressPercent}%`
      currentCheckIndex++;
      document.getElementById("bunsi").innerHTML = currentCheckIndex
      if(currentCheckIndex < Object.keys(checkList).length){
        checkStart()
      }else{
        console.log('すべての点検が完了しました')
        say('すべての点検が完了しました',{})
      }
    }
    if(transcript.includes('NG')){
      console.log("^^^^問題点の報告へ^^^^")
      recognition.stop()
      // 読み上げ開始
      say("問題点の報告をしてください",()=>{
        console.log('音声認識を開始します')
        finalTranscript=''
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
    finalTranscript += transcript;
    console.log(finalTranscript)
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

// ここからロジック実装
function checkStart(){
  finalTranscript=''

  if (currentCheckIndex < Object.keys(checkList).length) {
    const currentItem = checkList[currentCheckIndex];
    console.log(`###${currentItem}を開始します###`)
    say(`${currentItem}開始`,()=>{
      console.log('音声認識を開始します')
      recognition.start()
    });
  }else{
    console.log("点検完了")
  }

  }


document.getElementById("check-start").addEventListener('click',()=>{
  currentCheckIndex = 0; // 初期化
  checkStart();
})