const quizSocket = new WebSocket("ws://localhost:8080?client=quiz");

let question = [];
let options = [];
let correctAnswer = "";

quizSocket.onopen = () => {
    console.log("Quiz WebSocket connection opened.");
}

quizSocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.type === "questions") {
            question = data.question;
            options = data.options;
            correctAnswer = data.correctAnswer;
            console.log("Questions received from quizmaster:", question, options, correctAnswer);
            displayQuestions(question);
        }
    } catch (e) {
        console.log("Error parsing message:", e.message);
    }
}

function displayQuestions(questions) {
    const questionElement = document.getElementById("Question");
    questionElement.innerHTML = "";
    questionElement.insertAdjacentHTML("beforeend", `<h2>${questions}</h2>`);
}
