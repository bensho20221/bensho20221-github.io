//註冊
let check = document.querySelector('.btn-check');
let seeAnswer = document.querySelector('.btn-seeAnswer');
let reset = document.querySelector('.btn-reset');
let myInput = document.querySelector('#myInput');
let myRange = document.querySelector('#myRange');

//初始化設定
let min = 1;
let max = 100;
let correctAnswer = Math.floor(Math.random() * 100 + 1);
//事件監聽
//範圍變化
function numRange() {
    myRange.textContent = `當前範圍${min}~${max}`
}
//確認按鈕
myInput.addEventListener('click', function() {
    if(myInput.value === '點我猜數字'){
        myInput.value = '';
    }
})
check.addEventListener('click', function(){
    let inputValue = parseInt(myInput.value.trim());
    console.log(inputValue);
    if (inputValue === "" || isNaN(inputValue) || parseInt(inputValue) > max || parseInt(inputValue) < min){
        alert('請輸入正確的數字');
        if (myInput.value === '請輸入數字') {
        myInput.value = '';
    }
        return;
    }

    if(inputValue > correctAnswer){
        max = inputValue - 1;
    }
    else if (inputValue < correctAnswer){
        min = inputValue + 1;
    }
    else{
        alert(`你猜對了！答案是${correctAnswer}`);
    }
    numRange();
    myInput.value = '點我猜數字';
});
//看答案按鈕
seeAnswer.addEventListener('click', function(){
    correctAnswer = Math.floor(Math.random() * 100 + 1);
    alert(`正確答案是 ${correctAnswer}`);
    myInput.value = '點我猜數字';
})
//重置按鈕
reset.addEventListener('click', function(){
    correctAnswer = Math.floor(Math.random() * 100 + 1);
    min = 1;
    max = 100;
    numRange();
    myInput.value = '點我猜數字';
    alert(`正確答案是 ${correctAnswer}，放棄得太快了吧！`);
})