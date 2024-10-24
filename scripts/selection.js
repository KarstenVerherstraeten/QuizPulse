const queueSocket = new WebSocket("wss://quizpulse.onrender.com?client=queue");

queueSocket.onopen = function() {
    console.log("Connected to queue");
};


document.querySelector('#quizmaster').addEventListener('click', function() {
    window.location.href = "/pages/quizmaster.html";
    console.log("Quizmaster clicked");
});

document.querySelector('#player').addEventListener('click', function() {
    window.location.href = "/pages/question.html";
    console.log("Player clicked");
});