const quizmasterSocket = new WebSocket("ws://localhost:8080?client=quizmaster");

let askedQuestions = [];
let selectedQuestions = [];

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function handleQuizmasterSelection(index) {
    let selectedQuestion = selectedQuestions[index];
    askedQuestions.push(selectedQuestion);
    console.log(`The selected question is: ${selectedQuestion.question}`);

    quizmasterSocket.send(
        JSON.stringify({ 
            type: "questions", 
            questions: selectedQuestion.question,
			options: selectedQuestion.options,
			correctAnswer: selectedQuestion.correct_answer
        })
    );
    console.log("Question sent to the server");
}

window.handleQuizmasterSelection = handleQuizmasterSelection;

fetch("questions.json")
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		let shuffledQuestions = shuffleArray(data);

		selectedQuestions = shuffledQuestions.slice(0, 3);
		console.log(
			"Quizmaster, please pick one of the following questions:",
			selectedQuestions
		);

		let questionContainer = document.getElementById("question-container");
		selectedQuestions.forEach((question, index) => {
			let questionElement = document.createElement("div");
			questionElement.innerHTML = `
                <p>${question.question}</p>
                <button onclick="handleQuizmasterSelection(${index})">Select</button>
            `;
			questionContainer.appendChild(questionElement);
		});
	});

quizmasterSocket.onopen = () => {
	console.log("quizmaster WebSocket connection opened.");
};


quizmasterSocket.onclose = () => {
	console.log("Chat WebSocket connection closed.");
};

