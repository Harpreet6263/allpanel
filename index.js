const express = require("express");
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const connectDB = require("./config/db");
const Users = require("./models/Users");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // allow all for testing; change in production
        methods: ["GET", "POST"]
    }
});
app.use(cors());

connectDB();
app.use(express.json());

const PORT = process.env.PORT || 5000;

let clients = [];

io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        console.log("❌ No token provided");
        return next(new Error("Authentication error"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.user) {
            console.log("❌ User not found");
            return next(new Error("Unauthorized"));
        }
        const user = await Users.findById(decoded.user.id).select("-password");
        if (user.status != 1) {
            console.log("❌ Invalid or inactive user");
            return next(new Error("Unauthorized"));
        }
        socket.user = decoded.user; // Attach user info to socket
        next();
    } catch (err) {
        console.log("❌ Token verification failed");
        next(new Error("Invalid token"));
    }
});

// ✅ Handle socket connections
io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id, "| User:", socket.user.name);
    clients.push(socket);

    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
        clients = clients.filter(s => s.id !== socket.id);
    });
});

app.post("/api/receive-bet", (req, res) => {
    const payload = req.body;
    clients.forEach(socket => {
        socket.emit("bet-payload", payload);
    });
    // TODO: Save to DB or trigger other actions

    res.send({ status: "sent" });
});

app.use("/api/user", require("./routes/user"));


// app.listen(PORT, () => {
//   console.log(`🚀 Backend running at http://localhost:${PORT}`);
// });
server.listen(PORT, () => {
    console.log(`🚀 Backend running with WebSocket at http://localhost:${PORT}`);
});