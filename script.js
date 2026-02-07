const gridElement = document.getElementById("grid");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const undoBtn = document.getElementById("undoBtn");
const startBtn = document.getElementById("startBtn");
const timerDisplay = document.getElementById("timer");

let selectedCell = null;
let direction = "across";
let history = [];
let timerInterval;
let timeSpent = 0;
let gameStarted = false;

/* ========= COMPACT PUZZLE ========= */
/* 0 = block, letter = solution */

const puzzle = [
"0LIFECYCLE00",
"0N000000TBR0",
"0T000000CAPM",
"0C000NPVRULE",
"0OVERDEBRATIO",
"000000POISON0",
"000000SHARPE0",
"000000STDDEV0",
"000000UNSYSRISK",
"000000EMH0000",
"000000ABS0000",
"000000QUICK00",
"000000CALL000",
"000000NPV0000",
"000000BETA000"
];

function createGrid(){

    const rows = puzzle.length;
    const cols = Math.max(...puzzle.map(r => r.length));

    gridElement.style.gridTemplateColumns = `repeat(${cols},40px)`;

    let number = 1;

    for(let r=0; r<rows; r++){
        for(let c=0; c<cols; c++){

            const char = puzzle[r][c] || "0";

            if(char === "0"){
                const block = document.createElement("div");
                block.className = "block";
                gridElement.appendChild(block);
            } else {

                const wrapper = document.createElement("div");
                wrapper.style.position = "relative";

                const input = document.createElement("input");
                input.maxLength = 1;
                input.className = "cell";
                input.dataset.row = r;
                input.dataset.col = c;

                input.addEventListener("click", ()=>{
                    handleCellClick(input);
                });

                input.addEventListener("input", (e)=>{
                    history.push({cell:input});
                    e.target.value = e.target.value.toUpperCase();
                    moveNext(r,c);
                });

                input.addEventListener("keydown",(e)=>{
                    handleNavigation(e,r,c);
                });

                // Check if this cell starts Across or Down word
                const startsAcross =
                    (c === 0 || puzzle[r][c-1] === "0") &&
                    (puzzle[r][c+1] && puzzle[r][c+1] !== "0");

                const startsDown =
                    (r === 0 || puzzle[r-1][c] === "0") &&
                    (puzzle[r+1] && puzzle[r+1][c] !== "0");

                if(startsAcross || startsDown){
                    const numberSpan = document.createElement("span");
                    numberSpan.textContent = number;
                    numberSpan.className = "cell-number";
                    wrapper.appendChild(numberSpan);
                    number++;
                }

                wrapper.appendChild(input);
                gridElement.appendChild(wrapper);
            }
        }
    }
}

/* ================= TIMER ================= */

function startTimer(){
    timerInterval = setInterval(()=>{
        timeSpent++;
        let min = Math.floor(timeSpent/60);
        let sec = timeSpent%60;
        timerDisplay.textContent =
            (min<10?"0"+min:min)+":"+
            (sec<10?"0"+sec:sec);
    },1000);
}

/* ================= CELL LOGIC ================= */

function handleCellClick(cell){
    if(selectedCell === cell){
        direction = direction === "across" ? "down" : "across";
    }
    selectedCell = cell;
    highlightWord();
}

function highlightWord(){
    document.querySelectorAll(".cell").forEach(c=>c.classList.remove("active"));

    if(!selectedCell) return;

    let r = parseInt(selectedCell.dataset.row);
    let c = parseInt(selectedCell.dataset.col);

    if(direction === "across"){
        while(c>0 && puzzle[r][c-1] !== "0") c--;
        while(puzzle[r][c] && puzzle[r][c] !== "0"){
            focusCell(r,c,true);
            c++;
        }
    } else {
        while(r>0 && puzzle[r-1][c] !== "0") r--;
        while(puzzle[r] && puzzle[r][c] !== "0"){
            focusCell(r,c,true);
            r++;
        }
    }
}

function focusCell(r,c,highlight=false){
    const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
    if(cell){
        if(highlight) cell.classList.add("active");
        else cell.focus();
    }
}

function moveNext(r,c){
    if(direction === "across"){
        focusCell(r,c+1);
    } else {
        focusCell(r+1,c);
    }
}

function handleNavigation(e,r,c){
    if(e.key === "ArrowRight"){ direction="across"; focusCell(r,c+1); }
    if(e.key === "ArrowLeft"){ direction="across"; focusCell(r,c-1); }
    if(e.key === "ArrowDown"){ direction="down"; focusCell(r+1,c); }
    if(e.key === "ArrowUp"){ direction="down"; focusCell(r-1,c); }
}

/* ================= GAME CONTROL ================= */

startBtn.addEventListener("click", ()=>{
    const name = document.getElementById("playerName").value.trim();
    if(name===""){
        alert("Enter your name");
        return;
    }
    document.getElementById("startScreen").style.display="none";
    gameStarted = true;
    startTimer();
});

clearBtn.addEventListener("click", ()=>{
    document.querySelectorAll(".cell").forEach(c=>c.value="");
});

undoBtn.addEventListener("click", ()=>{
    let last = history.pop();
    if(last) last.cell.value="";
});

/* ================= VALIDATION ================= */

function checkAnswers(){
    let correct = true;
    document.querySelectorAll(".cell").forEach(cell=>{
        const r = cell.dataset.row;
        const c = cell.dataset.col;
        if(cell.value !== puzzle[r][c]){
            correct = false;
        }
    });
    return correct;
}

function generateCode(){
    const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result="";
    for(let i=0;i<52;i++){
        result+=chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return result;
}

submitBtn.addEventListener("click", ()=>{
    if(!gameStarted) return;

    clearInterval(timerInterval);

    if(checkAnswers()){
        const code = generateCode();
        alert("Correct!\nTime: "+timerDisplay.textContent+
              "\nCompletion Code:\n"+code);
        document.querySelectorAll(".cell").forEach(c=>c.disabled=true);
    } else {
        alert("Some answers are incorrect.");
        startTimer();
    }
});

/* ================= INIT ================= */

createGrid();
