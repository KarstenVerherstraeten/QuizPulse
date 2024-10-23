const queueSocket = new WebSocket("ws://localhost:8080?client=queue");

queueSocket.onopen = function() {
    console.log("Connected to queue");
};


document.querySelector('#quizmaster').addEventListener('click', function() {
    window.location.href = "quizmaster.html";
    console.log("Quizmaster clicked");
});

document.querySelector('#player').addEventListener('click', function() {
    window.location.href = "question.html";
    console.log("Player clicked");
});