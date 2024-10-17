let askedQuestions = [];
let selectedQuestions = [];

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Function to handle the quizmaster's selection
function handleQuizmasterSelection(index) {
    let selectedQuestion = selectedQuestions[index];
    askedQuestions.push(selectedQuestion);
    console.log(`The selected question is: ${selectedQuestion.question}`);
    // Apply the questions.js logic here
    // applyQuestionLogic(selectedQuestion);
}

// Attach the function to the window object to make it globally accessible
window.handleQuizmasterSelection = handleQuizmasterSelection;

fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let shuffledQuestions = shuffleArray(data);

        selectedQuestions = shuffledQuestions.slice(0, 3);
        console.log("Quizmaster, please pick one of the following questions:", selectedQuestions);

        // Assuming you have a function to send messages to players
        // sendMessageToPlayers("Quizmaster is selecting a question. Please wait...");

        // Insert questions into HTML for the quizmaster to choose
        let questionContainer = document.getElementById('question-container');
        selectedQuestions.forEach((question, index) => {
            let questionElement = document.createElement('div');
            questionElement.innerHTML = `
                <p>${question.question}</p>
                <button onclick="handleQuizmasterSelection(${index})">Select</button>
            `;
            questionContainer.appendChild(questionElement);
        });

        // Example of how the quizmaster might select a question
        // In a real scenario, this would be an event listener or similar
        // setTimeout(() => {
        //     let quizmasterChoice = selectedQuestions[0]; // Simulating a choice
        //     handleQuizmasterSelection(quizmasterChoice);
        // }, 5000); // Simulate a delay for the quizmaster to choose
    }
);