// 音声を読み上げる関数
function say (text, callback) {
  const play_option = new SpeechSynthesisUtterance()
  let speechTxt = text
  play_option.text = speechTxt;
  play_option.lang = 'ja-JP';
  speechSynthesis.cancel();
  window.speechSynthesis.speak(play_option)

  // 読み上げ完了時に実行する処理を指定
  play_option.onend = () => {
    console.log('読み上げが完了しました。');
    if (callback) callback(); // コールバック関数を呼び出す
  };
}

// 点検項目定義
const checkList ={
  0:'点検項目1',
  1:'点検項目2',
  2:'点検項目3',
  // 3:'点検項目4',
  // 4:'点検項目5',
  // 5:'点検項目6',
}
let finalTranscript = ''; // 確定した音声入力結果
let currentCheckIndex = 0; // 現在のチェック項目インデックス

// 音声認識インスタンス作成
const createRecognition = (onResultCallback) => {
  const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
  const recognition = new SpeechRecognition()
  recognition.lang = 'ja-JP'
  recognition.continuous=true
  recognition.onresult = onResultCallback;

  recognition.error = (event) => console.log('エラーが発生しました。', event.error)
  recognition.onaudiostart = () => console.log('録音が開始されました。')
  recognition.onend = () => console.log('音声認識が終了しました。')
  recognition.onnomatch = () => console.log('認識できませんでした。')
  return recognition;
}

// メイン音声認識
const recognition = createRecognition((event) => {
  console.log("-----onresult-----")
  for (let i = event.resultIndex; i < event.results.length; i++) {
    let transcript = event.results[i][0].transcript;
    finalTranscript += transcript;
    console.log(finalTranscript)
    console.log(event.results[i].isFinal)
    // say(transcript,()=>{})

    if(transcript.includes('次')){
      console.log("^^^^次の項目へ^^^^")
      recognition.stop()
      currentCheckIndex++;
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
    // if(event.results[i].isFinal){
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
