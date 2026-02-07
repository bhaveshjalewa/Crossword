const gridElement = document.getElementById("grid");
const startBtn = document.getElementById("startBtn");
const timerDisplay = document.getElementById("timer");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const undoBtn = document.getElementById("undoBtn");

let history = [];
let timerInterval;
let timeLeft = 2400; // 40 minutes

// Crossword Layout (1 = letter cell, 0 = black block)
const layout = [
"111111110000000",
"000000001000000",
"001111110000000",
"000000000000000",
"111111110000000",
"111111110000000",
"111111110000000",
"111111110000000",
"111111110000000",
"111000000000000",
"111000000000000",
"111000000000000",
"111000000000000",
"111000000000000",
"111000000000000"
];

function createGrid(){
    layout.forEach(row=>{
        row.split("").forEach(cell=>{
            if(cell==="1"){
                let input=document.createElement("input");
                input.maxLength=1;
                input.className="cell";
                input.addEventListener("input",()=>{
                    history.push(input);
                });
                gridElement.appendChild(input);
            }else{
                let block=document.createElement("div");
                block.className="block";
                gridElement.appendChild(block);
            }
        });
    });
}

function startTimer(){
    timerInterval = setInterval(()=>{
        let minutes=Math.floor(timeLeft/60);
        let seconds=timeLeft%60;
        timerDisplay.textContent=
            minutes+":"+(seconds<10?"0"+seconds:seconds);
        timeLeft--;
        if(timeLeft<0){
            clearInterval(timerInterval);
            alert("Time Over!");
        }
    },1000);
}

startBtn.addEventListener("click",()=>{
    const code=document.getElementById("accessCode").value;
    if(code.length===52){
        document.getElementById("startScreen").style.display="none";
        startTimer();
    }else{
        alert("Access code must be 52 characters.");
    }
});

clearBtn.addEventListener("click",()=>{
    document.querySelectorAll(".cell").forEach(c=>c.value="");
});

undoBtn.addEventListener("click",()=>{
    let last=history.pop();
    if(last) last.value="";
});

submitBtn.addEventListener("click",()=>{
    alert("Submission received. Manual evaluation required.");
});

createGrid();
