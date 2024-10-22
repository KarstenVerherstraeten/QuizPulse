const quizSocket = new WebSocket("ws://localhost:8080?client=quiz");

let questions = [];

quizSocket.onopen = () => {
    console.log("Quiz WebSocket connection opened.");
}

quizSocket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.type === "questions") {
            questions = data.questions;
            console.log("Questions received from quizmaster:", questions);
            displayQuestions(questions);
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
