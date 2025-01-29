// ---------------------------async---------------------------------------------
//async functionは呼び出されるとPromiseを返す
//以下はasync functionがPromiseを返し、値をresolve、もしくはrejectしているか確認するための利用例。
//async functionがPromiseを返し、値をresolve、もしくはrejectしていることがわかった。

// resolve1!!をreturnしているため、この値がresolveされる
async function resolveSample() {
    return 'resolve!!';
}

// resolveSampleがPromiseを返し、resolve!!がresolveされるため
// then()が実行されコンソールにresolve!!が表示される
resolveSample().then(value => {
    console.log(value); // => resolve!!
});


// reject!!をthrowしているため、この値がrejectされる
async function rejectSample() {
    throw new Error('reject!!');
}

// rejectSampleがPromiseを返し、reject!!がrejectされるため
// catch()が実行されコンソールにreject!!が表示される
rejectSample().catch(err => {
    console.log(err); // => reject!!
});


// resolveErrorはasync functionではないため、Promiseを返さない。動かない
function resolveError() {
    return 'resolveError!!!!!';
}

// resolveErrorはPromiseを返さないため、エラーが発生して動かない
// Uncaught TypeError: resolveError(...).then is not a function
console.log(resolveError())
resolveError().then(value => {
    console.log(value);
});


// ---------------------------await----------------------------
// async function内でPromiseの結果（resolve、reject）が返されるまで待機する（処理を一時停止する）演算子のこと。
// 以下のように、関数の前にawaitを指定すると、その関数のPromiseの結果が返されるまで待機する。
// awaitを指定した関数のPromiseの結果が返されるまで、async function内の処理を一時停止する。
// 結果が返されたらasync function内の処理を再開する。
// awaitはasync function内でないと利用できないため、async/awaitの利用例を見ていく。


//---------------------------利用例-----------------------------

function sampleResolve(value){
    return new Promise(resolve =>{
        setTimeout(()=>{
            resolve(value*2)
        },2000)
    })
}

async function sample() {
    const result = await sampleResolve(5)
    return result + 5
}

sample.then(result =>{
    console.log(result)
})