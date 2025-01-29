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


// resolveErrorはasync functionではないため、Promiseを返さない
function resolveError() {
  return 'resolveError!!';
}

// resolveErrorはPromiseを返さないため、エラーが発生して動かない
// Uncaught TypeError: resolveError(...).then is not a function
resolveError().then(value => {
  console.log(value);
});
