// import express, { Express, Request, Response } from "express";
// import http from "http";
// import { Server, Socket } from "socket.io";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app: Express = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });
// const port = process.env.PORT || 8000;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });
// io.on("connection", (socket: Socket) => {
//   console.log("me", socket.id);

//   // Send a welcome message to the connected client

//   // Listen for messages from the client
//   socket.on("callUser", (data) => {
//     // Broadcast the message to all connected clients
//     io.to(data.userToCall).emit("callUser", {
//       signal: data.signalData,
//       from: data.from,
//       name: data.name,
//     });
//   });

//   // Listen for disconnection
//   socket.on("disconnect", () => {
//     socket.broadcast.emit("callEnded");
//   });

//   socket.on("answerCall", (data) => {
//     io.to(data.to).emit("callAccepted"), data.signal;
//   });
// });

// server.listen(port, () => {
//   console.log(`[server]: Server is running at http://localhost:${port}`);
// });

import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

interface Users {
  [key: string]: string[];
}

const users: Users = {};

interface SocketToRoom {
  [key: string]: string;
}

const socketToRoom: SocketToRoom = {};

io.on("connection", (socket) => {
  socket.on("join room", (roomID: string) => {
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
