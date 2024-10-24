const quizSocket = new WebSocket("wss://quizpulse.onrender.com?client=quiz");

let question = "wait for the quizmaster to send a question";
let options = [];
let image = "";

quizSocket.onopen = () => {
    console.log("Quiz WebSocket connection opened.");
}

quizSocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.type === "questions") {
            const questionData = data.questionData; // Access the full object
            question = questionData.question;
            options = questionData.options; // Now an array of objects
            image = questionData.image;
            console.log("Questions received from quizmaster:", questionData);
            displayQuestions(question);
            displayAnswers(options);
        }
    } catch (e) {
        console.log("Error parsing message:", e.message);
    }
}

function displayQuestions(questionText) {
    const questionElement = document.getElementById("Question");
    questionElement.innerHTML = "";
    questionElement.insertAdjacentHTML("beforeend", `<h2>${questionText}</h2>`);
    questionElement.insertAdjacentHTML("beforeend", `<img src="${image}" alt="${questionText}">`);
    questionElement.insertAdjacentHTML("beforeend", `<p>Choose the correct answer:</p>`);
    progresBar();
}

function progresBar(){

let progressBarContainer = document.createElement("div");
progressBarContainer.classList.add("progress-bar-container");

let progressBar = document.createElement("div");
progressBar.classList.add("progress-bar");
progressBarContainer.appendChild(progressBar);
document.body.appendChild(progressBarContainer);

let timeLeft = 15;
let interval = setInterval(() => {
    timeLeft--;
    progressBar.style.width = `${(15 - timeLeft) * (100 / 15)}%`;
    if (timeLeft <= 0) {
        clearInterval(interval);
        document.body.removeChild(progressBarContainer);
       
        window.location.href = ""; // redirect to leaderboards

        //check if selected answer is correct
       
    }
}, 1000);
}

function displayAnswers(options) {
    const optionsElement = document.getElementById("answers");
    optionsElement.innerHTML = "";

    // Loop through the options array
    options.forEach((option) => {
        // Create a button for each option
        optionsElement.insertAdjacentHTML("beforeend", `
            <button onclick="handleAnswerSelection('${option.option}', ${option.isCorrect})">${option.option}</button>
        `);
    });
}

window.handleAnswerSelection = handleAnswerSelection;
function handleAnswerSelection(selectedOption, isCorrect) {
    if (isCorrect) {
        alert("Correct answer!");
    } else {
        alert("Wrong answer.");
    }
}