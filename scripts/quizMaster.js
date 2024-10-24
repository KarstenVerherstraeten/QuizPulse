const quizmasterSocket = new WebSocket("wss://quizpulse.onrender.com?client=quizmaster");

let askedQuestions = [];
let selectedQuestions = [];
let currentQuestion = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function handleQuizmasterSelection(index) {
    let selectedQuestion = selectedQuestions[index];
    currentQuestion.push(selectedQuestion);
    askedQuestions.push(selectedQuestion);
    selectedQuestions.splice(index, 1); // Remove the selected question

    disableButtonsAndShowProgressBar();

    const optionsArray = Object.entries(selectedQuestion.options).map(([key, value]) => ({
        option: value,
        isCorrect: key === selectedQuestion.correct_answer,
    }));

    quizmasterSocket.send(
        JSON.stringify({
            type: "questions",
            questionData: {
                question: selectedQuestion.question,
                options: optionsArray, // Send structured options
                image: selectedQuestion.image
            }
        })
    );
    console.log("Question sent to the server");

    // Maintain three questions after selection
    fetchNewQuestionsIfNeeded();
}

function disableButtonsAndShowProgressBar() {
    console.log(askedQuestions);
    
    document.querySelectorAll("#question-container").forEach(element => {
        element.style.display = "none";
    });

    document.querySelector('#selectedQuestion').innerHTML = ""; 

    document.querySelector('#selectedQuestion').insertAdjacentHTML("beforeend",`<h2>Your selected question is: <br> ${currentQuestion[0].question}</h2>`); 
    document.querySelector('#selectedQuestion').style.display = "block"; // Corrected this line

    // Create and display a progress bar
    let progressBarOuterContainer = document.createElement("div");
    progressBarOuterContainer.classList.add("progress-bar-outer-container");

    let progressBarContainer = document.createElement("div");
    progressBarContainer.classList.add("progress-bar-container");

    let progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBarContainer.appendChild(progressBar);
    progressBarOuterContainer.appendChild(progressBarContainer);
    document.body.appendChild(progressBarOuterContainer);

    let timeLeft = 15;
    let interval = setInterval(() => {
        timeLeft--;
        progressBar.style.width = `${(15 - timeLeft) * (100 / 15)}%`;
        if (timeLeft <= 0) {
            clearInterval(interval);
            document.body.removeChild(progressBarOuterContainer);
            // Enable buttons after the time is up
            enableButtons();
            currentQuestion.splice(0, 1); // Remove the displayed question
            
            // Maintain three questions after time is up
            fetchNewQuestionsIfNeeded();
        }
    }, 1000);
}

// Function to enable buttons
function enableButtons() {
    document.querySelectorAll("#question-container").forEach(element => {
        element.style.display = "";
    });

    document.querySelector('#selectedQuestion').style.display = "none"; // Corrected this line
}

// Function to fetch new questions if needed
function fetchNewQuestionsIfNeeded() {
    // If we have less than 3 selected questions, fetch new ones
    if (selectedQuestions.length < 3) {
        fetch("/scripts/questions.json")
            .then((response) => response.json())
            .then((data) => {
                let shuffledQuestions = shuffleArray(data);
                
                // Remove already asked questions from the new selection
                const remainingQuestions = shuffledQuestions.filter(
                    question => !askedQuestions.includes(question)
                );

                // Select additional questions to maintain 3 in total
                const additionalQuestionsNeeded = 3 - selectedQuestions.length;
                selectedQuestions.push(...remainingQuestions.slice(0, additionalQuestionsNeeded));
                updateQuestionContainer();
            });
    }
}

// Function to update the question container UI
function updateQuestionContainer() {
    let questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = ""; // Clear previous questions

    selectedQuestions.forEach((question, index) => {
        let questionElement = document.createElement("div");
        questionElement.innerHTML = `
            <p>${question.question}</p>
            <button onclick="handleQuizmasterSelection(${index})">Select</button>
        `;
        questionContainer.appendChild(questionElement);
    });
}

window.handleQuizmasterSelection = handleQuizmasterSelection;

// Initial fetch of questions
fetch("/scripts/questions.json")
    .then((response) => response.json())
    .then((data) => {
        let shuffledQuestions = shuffleArray(data);
        selectedQuestions = shuffledQuestions.slice(0, 3); // Start with 3 questions
        updateQuestionContainer();
    });

quizmasterSocket.onopen = () => {
    console.log("quizmaster WebSocket connection opened.");
};

quizmasterSocket.onclose = () => {
    console.log("Chat WebSocket connection closed.");
};