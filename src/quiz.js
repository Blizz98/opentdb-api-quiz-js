let questionCount = 0;
let questionId = 0;
let questionPool = [];
let answers = [];
let answerCount;
let random;
let score = 0;
let category = 0;
let difficulty = "";

const ContinueToDifficulty = (cat) =>{
    category = cat;
    console.log(category);
    document.getElementById("difficulty").style.transform = "translateX(0%)";
    document.getElementById("category").style.transform = "translateX(-500%)";
}

const ContinueToStart = (dif) =>{
    difficulty = dif;
    console.log(difficulty);
    document.getElementById("difficulty").style.transform = "translateX(-500%)";
    document.getElementById("game").style.display = "block";
    StartQuiz();
    document.getElementById("game").style.transform = "scale(1)";
} 

const StartQuiz = () =>{
    const settings = "&category=" + category + "&difficulty=" + difficulty;
    console.log(settings);
    fetch("https://opentdb.com/api.php?amount=10" + settings).then(res => res.json()).then(data => {
        questionPool = data.results;
        questionCount = questionPool.length;
        console.log("Question Count: " + questionCount);
        console.log(questionPool);
        ShowQuestion();
    });
};

const ShowQuestion = () =>{
    answerCount = questionPool[questionId].incorrect_answers.length + 1;
    random = Math.floor(Math.random() * answerCount);
    document.querySelector("#question").innerHTML = questionPool[questionId].question;
    console.log("Answer Count: " + answerCount);
    console.log("Random Number: " + random);
    console.log("Correct Answer: " + questionPool[questionId].correct_answer);
    console.log("Incorrect Answers: " + questionPool[questionId].incorrect_answers);
    console.log(answers);

    document.getElementById("btn-next").disabled = true;
    for(let i = 0; i < answerCount; i++){
        if(questionPool[questionId].type == "multiple"){
            answers.push(questionPool[questionId].incorrect_answers[i]);
            if(i == 3){
                answers[3] = questionPool[questionId].correct_answer;
            }
        }else{
            answers.push(questionPool[questionId].incorrect_answers[i]);
            if(i == 1){
                answers[1] = questionPool[questionId].correct_answer;
            }
        }
    }
    for(let i = 0; i < answerCount; i++){
        if(questionPool[questionId].type == "multiple"){
            let btn = document.createElement("button");
            if(i == random){
                btn.innerHTML = answers[3];
                btn.classList.add("btn-answer");
                btn.setAttribute("id", "correct");
                btn.addEventListener("click", CorrectAnswer, false);
            }else{
                btn.innerHTML = answers[i];
                btn.classList.add("btn-answer");
                btn.setAttribute("id", "incorrect");
                btn.addEventListener("click", IncorrectAnswer, false);
            }
            if(i == 3 && random != 3){
                btn.innerHTML = answers[random];
            }
            document.querySelector(".answers").appendChild(btn);
        }else{
            let btn = document.createElement("button");
            if(i == random){
                btn.innerHTML = questionPool[questionId].correct_answer;
                btn.classList.add("btn-answer");
                btn.setAttribute("id", "correct");
                btn.addEventListener("click", CorrectAnswer, false);
            }else{
                btn.innerHTML = questionPool[questionId].incorrect_answers[0];
                btn.classList.add("btn-answer");
                btn.setAttribute("id", "incorrect");
                btn.addEventListener("click", IncorrectAnswer, false);
            }
            document.querySelector(".answers").appendChild(btn);
        }
    }
}

const NextQuestion = () =>{
    const btnNextQuestion = document.getElementById("nextQuestionBtn");
    const answersElement = document.getElementById("answers");
    const questionIdElement = document.getElementById("question-id");
    if(questionId == questionCount - 1){
        btnNextQuestion.disabled = true;
    }else{
        questionId++;
        questionIdElement.innerHTML = (questionId + 1) + " / " + questionCount;
        if(answers.length > 0){
            answers = [];
        }
        if(answersElement.childNodes.length > 0){
            while(answersElement.firstChild){
                answersElement.removeChild(answersElement.firstChild);
            }
        }
        document.getElementById("btn-next").disabled = true;
        if(questionId + 1 == questionCount){
            document.getElementById("btn-next").innerHTML = "Complete Quiz!";
            document.getElementById("btn-next").onclick = CompleteQuiz;
        }else{
            document.getElementById("btn-next").innerHTML = "Next Question";
        }
        ShowQuestion();
    }
}

const CorrectAnswer = () =>{
    const scoreElement = document.getElementById("score");
    console.log("CORRECT");
    score += 10;
    scoreElement.innerHTML = "Score: " + score;
    document.getElementById("btn-next").disabled = false;
    document.getElementById("correct").style.backgroundColor = "green";

    let btns = []
    for(let i = 0; i < document.querySelectorAll(".btn-answer").length; i++){
        btns.push(document.querySelectorAll(".btn-answer")[i]);
    }
    btns.map(DisableButton);
}

const IncorrectAnswer = () =>{
    const scoreElement = document.getElementById("score");
    console.log("INCORRECT");
    scoreElement.innerHTML = "Score: " + score;
    document.getElementById("btn-next").disabled = false;
    document.getElementById("correct").style.backgroundColor = "green";

    let btns = []
    for(let i = 0; i < document.querySelectorAll(".btn-answer").length; i++){
        btns.push(document.querySelectorAll(".btn-answer")[i]);
    }
    btns.map(DisableButton);
}

const DisableButton = (btn) =>{
    console.log(btn);
    btn.disabled = true;
}

const CompleteQuiz = () =>{
    document.getElementById("game").style.transform = "translateX(-200%)";
    document.getElementById("game-over").style.transform = "scale(1)";
    document.getElementById("game-over").style.transition = "all 3s ease";
    document.getElementById("correct-answers").innerHTML = score / 10;
    document.getElementById("question-count").innerHTML = questionCount;
    document.getElementById("final-score").innerHTML = score;
}