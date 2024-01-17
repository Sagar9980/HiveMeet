"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
}));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
const port = process.env.PORT || 8000;
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
io.on("connection", (socket) => {
    console.log("A user connected");
    // Send a welcome message to the connected client
    socket.emit("message", "Welcome to the Socket.IO server!");
    // Listen for messages from the client
    socket.on("chatMessage", (message) => {
        // Broadcast the message to all connected clients
        io.emit("message", message);
    });
    // Listen for disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
