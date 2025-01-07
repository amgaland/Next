const io = require("socket.io")(3001, {
  cors: {
    origin: "http://127.0.0.1:5500", // Allow requests from this specific frontend address
    methods: ["GET", "POST"], // Allow only GET and POST methods
  },
});

const users = {};
const matchmakingQueue = [];

io.on("connection", (socket) => {
  // Handle the event when a new user connects
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.emit("welcome", `Welcome, ${name}!`);
  });

  // Handle when a user joins the matchmaking queue
  socket.on("join-queue", () => {
    matchmakingQueue.push(socket.id);
    console.log(`${users[socket.id]} joined the queue.`);

    socket.emit("joined-queue", {
      status: "You are in the matchmaking queue.",
      position: matchmakingQueue.length,
    });

    // If there are at least two users in the queue, make a match
    if (matchmakingQueue.length >= 2) {
      const player1 = matchmakingQueue.shift();
      const player2 = matchmakingQueue.shift();
      io.to(player1).emit("match-found", { opponent: users[player2] });
      io.to(player2).emit("match-found", { opponent: users[player1] });
      console.log(`Match found: ${users[player1]} vs ${users[player2]}`);
    }
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];

    const index = matchmakingQueue.indexOf(socket.id);
    if (index !== -1) {
      matchmakingQueue.splice(index, 1);
    }
  });
});
