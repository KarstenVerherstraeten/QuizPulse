const quizSocket = new WebSocket("ws://localhost:8080?client=quiz");

let question = "wait for the quizmaster to send a question";
let options = [];

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