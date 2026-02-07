const gridElement = document.getElementById("grid");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const undoBtn = document.getElementById("undoBtn");
const startBtn = document.getElementById("startBtn");
const timerDisplay = document.getElementById("timer");

const SIZE = 15;
let selectedCell = null;
let direction = "across";
let history = [];
let timerInterval;
let timeSpent = 0;
let gameStarted = false;

/* ================= PUZZLE STRUCTURE ================= */

const solution = [
" LIFECYCLE    ",
"        TBRATE",
"  CAPM        ",
"NPVRULE       ",
"DEBRATIO      ",
"POISON        ",
"SHARPE        ",
"STDDEV        ",
"UNSYSRISK     ",
"EMH           ",
"ABS           ",
"QUICK         ",
"CALL          ",
"NPV           ",
"BETA          "
];

/* ================= GRID CREATION ================= */

function createGrid(){
    for(let r=0;r<SIZE;r++){
        for(let c=0;c<SIZE;c++){
            const char = solution[r][c] || " ";
            if(char === " "){
                const block = document.createElement("div");
                block.className = "block";
                gridElement.appendChild(block);
            } else {
                const input = document.createElement("input");
                input.maxLength = 1;
                input.className = "cell";
                input.dataset.row = r;
                input.dataset.col = c;

                input.addEventListener("click", ()=>{
                    handleCellClick(input);
                });

                input.addEventListener("input", (e)=>{
                    history.push({cell:input, val:e.target.value});
                    e.target.value = e.target.value.toUpperCase();
                    moveNext(r,c);
                });

                input.addEventListener("keydown", (e)=>{
                    handleNavigation(e,r,c);
                });

                gridElement.appendChild(input);
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

/* ================= CELL SELECTION ================= */

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
        while(c>0 && solution[r][c-1] !== " ") c--;
        while(c<SIZE && solution[r][c] !== " "){
            focusCell(r,c,true);
            c++;
        }
    } else {
        while(r>0 && solution[r-1][c] !== " ") r--;
        while(r<SIZE && solution[r][c] !== " "){
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

/* ================= NAVIGATION ================= */

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
        if(cell.value !== solution[r][c]){
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
        alert("Correct Submission!\n\nTime: "+timerDisplay.textContent+
              "\nCompletion Code:\n"+code);
        document.querySelectorAll(".cell").forEach(c=>c.disabled=true);
    } else {
        alert("Some answers are incorrect.");
        startTimer();
    }
});

/* ================= INIT ================= */

createGrid();
