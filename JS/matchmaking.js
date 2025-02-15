const socket = io("http://localhost:3001");

const statusText = document.getElementById("status-text");
const joinButton = document.getElementById("join-button");

const name = prompt("Enter your name to start matchmaking:");

socket.emit("new-user", name);

socket.on("welcome", (message) => {
  console.log(message);
});

socket.on("match-found", (data) => {
  statusText.textContent = `You are matched with ${data.opponent}. Good luck!`;
  joinButton.disabled = true; // Match oldvol towchluur idevhgui bolno
});

socket.on("user-disconnected", (name) => {
  console.log(`${name} disconnected`);
});

// Hereglegch amjilttai holbogdson esehiig sonsono
socket.on("joined-queue", (data) => {
  statusText.textContent = `${data.status} Position in queue: ${data.position}`;
});

joinButton.addEventListener("click", () => {
  socket.emit("join-queue");
  statusText.textContent = "You are in the queue. Waiting for a match...";
  joinButton.disabled = true; // Tovch daragdsan tohioldold idehgui bolno
});
