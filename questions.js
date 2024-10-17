let askedQuestions = []; // Array to keep track of asked questions

// Function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // Shuffle the questions for random order
        let shuffledQuestions = shuffleArray(data);

        // Function to load the next question
        function loadNextQuestion() {
            // Find the next question that hasn't been asked yet
            const nextQuestion = shuffledQuestions.find(q => !askedQuestions.includes(q));

            if (nextQuestion) {
                askedQuestions.push(nextQuestion); // Mark this question as asked

                // Generate the options HTML
                let optionsHTML = "";
                for (let option in nextQuestion.options) {
                    optionsHTML += `<button class="answer-option" data-correct="${option === nextQuestion.correct_answer}">${nextQuestion.options[option]}</button>`;
                }

                // Insert the question and options into the DOM
                document.querySelector("#quiz").innerHTML = `
                    <div class="question">
                        <h1>${nextQuestion.question}</h1>
                        ${nextQuestion.image ? `<img src="${nextQuestion.image}" alt="${nextQuestion.question}">` : ""}
                    </div>

                    <div class="answers">
                        ${optionsHTML}
                    </div>
                `;

                // Add event listeners to the options
                document.querySelectorAll(".answer-option").forEach(button => {
                    button.addEventListener("click", function() {
                        const isCorrect = this.getAttribute("data-correct") === "true";
                        alert(isCorrect ? "Correct!" : "Incorrect!");

                        // Load the next question after the user answers
                        loadNextQuestion();
                    });
                });
            } else {
                // All questions have been asked
                alert("Quiz completed!");
            }
        }

        // Start by loading the first question
        loadNextQuestion();
    });