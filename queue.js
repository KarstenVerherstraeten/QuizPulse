const url = 'ws://localhost:8080';
const ws = new WebSocket(url);

ws.onopen = function() {
    console.log("Connected to WebSocket server");
};

ws.addEventListener("message", function (event) {
    try {
        const data = JSON.parse(event.data);

        if (data.type === 'users') {
            const username = data.username;
            updateUserList(username);
        }
    } catch (e) {
        console.log('Error parsing JSON:', e.message);
    }
});

// Handle form submission to add a user
document.getElementById("addUser").addEventListener("submit", function (event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    if (username.trim() === "") {
        console.log("Username cannot be empty");
        return;
    }

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: "users",
            username: username
        }));

        // Clear input after submission
        document.getElementById("username").value = "";
    } else {
        console.log("WebSocket is not open");
    }

    document.getElementById("addUser").style.display = "none";
});

// Function to update the user list in the DOM
let currentUser = ""; // Variable to store the current user's name

function updateUserList(username) {
    // If the current user is not set, assign the value
    if (!currentUser) {
        currentUser = username;
    }

    const userList = document.getElementById("userList");
    
    // Create a list item for the user
    const userItem = document.createElement("li");
    
    // If the username matches the current user, label them as "You"
    if (username === currentUser) {
        userItem.textContent = `You: ${username}`;
        userItem.style.fontWeight = 'bold'; // Make the current user bold
        userItem.style.color = 'blue'; // Highlight the current user with blue
    } else {
        userItem.textContent = username;
    }

    // Append the new user to the list
    userList.appendChild(userItem);
}