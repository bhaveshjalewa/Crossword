const gridElement = document.getElementById("grid");
const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const undoBtn = document.getElementById("undoBtn");
const timerDisplay = document.getElementById("timer");

let history = [];
let timerInterval;
let timeSpent = 0;

// 15x15 Layout (1=letter, 0=block)
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

// Correct Answers Set
const correctAnswers = [
"LIFECYCLE","TBRATE","CAPM","NPVRULE","DEBRATIO",
"POISON","SHARPE","STDDEV","UNSYSRISK","EMH",
"ABS","QUICK","CALL","NPV","BETA",
"INTCOVER","CRAR","SYSTEMIC","IMMUNIZE","ERP",
"FOURPCT","BIRDHAND","FRONTIER","DURATION","VIX",
"RISKSHIFT","YTM","WACC","ES","LBO"
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
        timeSpent++;
        let minutes=Math.floor(timeSpent/60);
        let seconds=timeSpent%60;
        timerDisplay.textContent =
        (minutes<10?"0"+minutes:minutes)+":"+
        (seconds<10?"0"+seconds:seconds);
    },1000);
}

function generateCode(){
    const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result="";
    for(let i=0;i<52;i++){
        result+=chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return result;
}

startBtn.addEventListener("click",()=>{
    const name=document.getElementById("playerName").value.trim();
    if(name===""){
        alert("Enter your name.");
        return;
    }
    document.getElementById("startScreen").style.display="none";
    startTimer();
});

submitBtn.addEventListener("click",()=>{
    clearInterval(timerInterval);

    // Simple validation (minimum filled cells)
    let filled=0;
    document.querySelectorAll(".cell").forEach(c=>{
        if(c.value!=="") filled++;
    });

    if(filled<50){
        alert("Incomplete crossword.");
        return;
    }

    let code=generateCode();
    alert("Correct Submission!\n\nCompletion Code:\n"+code);
});

clearBtn.addEventListener("click",()=>{
    document.querySelectorAll(".cell").forEach(c=>c.value="");
});

undoBtn.addEventListener("click",()=>{
    let last=history.pop();
    if(last) last.value="";
});

createGrid();
