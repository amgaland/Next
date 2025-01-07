const io = require("socket.io")(3000);

const users = {};
const matchmakingQueue = []; // Queue for matchmaking

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.emit("welcome", `Welcome, ${name}!`);
  });

  socket.on("join-queue", () => {
    // Add user to matchmaking queue
    matchmakingQueue.push(socket.id);
    console.log(`${users[socket.id]} joined the queue.`);

    // Emit a confirmation to the client
    socket.emit("joined-queue", {
      status: "You are in the matchmaking queue.",
      position: matchmakingQueue.length,
    });

    // Try to match the user if there's another one in the queue
    if (matchmakingQueue.length >= 2) {
      const player1 = matchmakingQueue.shift();
      const player2 = matchmakingQueue.shift();
      io.to(player1).emit("match-found", { opponent: users[player2] });
      io.to(player2).emit("match-found", { opponent: users[player1] });
      console.log(`Match found: ${users[player1]} vs ${users[player2]}`);
    }
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
    // Remove user from matchmaking queue if disconnected
    const index = matchmakingQueue.indexOf(socket.id);
    if (index !== -1) {
      matchmakingQueue.splice(index, 1);
    }
  });
});
