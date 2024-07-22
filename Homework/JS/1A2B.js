const startBtn = document.querySelector("#start_btn");
const showAnsBtn = document.querySelector("#show_answer_btn");
const restartBtn = document.querySelector("#restart_btn");
const guessHistoryList = document.querySelector("#guess_history_list");
let answer;
const guessInput =document.querySelector("#guess_input");
const guessBtn = document.querySelector("#guess_btn");
const gameMsgToast = document.querySelector("#game_msg_toast");
const toastBootstrap = new bootstrap.Toast(gameMsgToast, {
    delay: 800, //延遲後消失
    // autohide:false 自動消失(預設開)
    // animation:false 動畫(預設開)
}); //其中一種寫法(bootstrap針對JS開發的建構式)

// gameMsgToast.addEventListener("hide.bs.toast", () => {
//     console.log("toast hide!");
// }); //hint消失時主控台跳訊息

const modalBootstrap = new bootstrap.Modal(document.querySelector("#end_game_modal"));

const endGameBtn = document.querySelector("#end_game_btn");

function initGame() {
    //產出answer
    answer = generateAns();
    //清空紀錄，不能用.value，ul沒有這個屬性，也不會對其子元素(li)有作用
    guessHistoryList.innerHTML = "";
}

function generateAns() {
    const numArr = [0,1,2,3,4,5,6,7,8,9];

    numArr.sort((a, b) => getRandomArbitrary(-1, 1)); //a < b => -1 , a > b => 1，

    return numArr.slice(0,4).join("");
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

startBtn.addEventListener("click", initGame);

restartBtn.addEventListener("click", initGame);

showAnsBtn.addEventListener("click", () => {
    showHint(`答案是 ${answer}`);
});

guessBtn.addEventListener("click", () => {
    const val = guessInput.value.trim();
    console.log(val);
    //驗證輸入的合法性
    if(val === "" || isNaN(val)){
        showHint("請輸入合法的數字!")
        guessInput.value = ""; //送出就清空
        return;
    }
    //輸入的是不重複的4個數字(Set只會存不同的值)
    if(val.length > 4 || new Set(val).size !== 4){
        showHint("請確認輸入數字的數量!")
        guessInput.value = "";
        return;
    }
    //a,b
    let a = 0;
    let b = 0;
    for(let i = 0; i < answer.length; i++){
        if(val[i] === answer[i]){
            a++;
        }
        else if(answer.includes(val[i])) { //answer包含了val[i]這個值
            b++;
        }
    }
    if(a === 4){
        //過關
        modalBootstrap.show();
    }

    guessInput.value = "";
    appendHistory(a,b,val); //新建一個fn，為了加紀錄
});

function appendHistory(a, b, input) { //長出li必要的東西
    const li = document.createElement("li");
    li.classList.add("list-group-item"); //classList是DOM用來動態操作的其中一個屬性
    const span = document.createElement("span");
    const badgeColor = a === 4 ? "bg-success" : "bg-danger";
    span.classList.add("badge", badgeColor);
    span.textContent = `${a}A${b}B`;
    li.append(span, input);
    guessHistoryList.append(li); //li結果加進ul內，且append會把結果轉為nodes
}


function showHint(msg) {
    gameMsgToast.querySelector(".toast-body").textContent = msg; //gameMsgToast已經註冊，這裡是針對內部的toast-body註冊，為了處理其中的訊息
    // const toastBootstrap = bootstrap.Toast.getOrCreateInstance(gameMsgToast); //其中一種寫法(bootstrap靜態方法)
    toastBootstrap.show();
}

endGameBtn.addEventListener("click", () => {
    modalBootstrap.hide();
});