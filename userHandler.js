if (window.location.pathname.endsWith("index.html")) {
	document
		.getElementById("addUser")
		.addEventListener("submit", function (event) {
			const username = document.getElementById("username").value;

			if (username) {
				addUser({ name: username });
			}
			event.preventDefault();
		});
}

// Function to add user and store in localStorage
function addUser(user) {
	let users = JSON.parse(localStorage.getItem("users")) || []; // Get existing users or initialize an empty array
	users.push(user);
	localStorage.setItem("users", JSON.stringify(users)); // Store updated users in localStorage
	window.location.href = "queue.html"; // Redirect to queue page
}
