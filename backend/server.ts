import express, { Express, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
io.on("connection", (socket: Socket) => {
  console.log("me", socket.id);

  // Send a welcome message to the connected client

  // Listen for messages from the client
  socket.on("callUser", (data) => {
    // Broadcast the message to all connected clients
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  // Listen for disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted"), data.signal;
  });
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
