"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const socket = io("http://localhost:8000");

  socket.on("message", (message) => {
    console.log("Message from server:", message);
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="p-4 dark flex flex-col items-center space-y-4 bg-gray-800 text-white">
        <h1 className="text-3xl font-bold">Join Chat</h1>
        <p className="text-gray-400">
          Enter your chat code below to join the conversation.
        </p>
        <form className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <label className="text-gray-300" htmlFor="chat-code">
              Chat Code
            </label>
            <input
              className="bg-gray-700 px-4 py-2 ml-2 text-white placeholder-gray-500"
              id="chat-code"
              placeholder="Enter chat code..."
            />
          </div>
          <div className="flex space-x-4">
            <button
              className="bg-blue-600 px-4 py-2 rounded-sm text-white hover:bg-blue-700"
              type="submit"
            >
              Join Chat
            </button>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded-sm hover:bg-gray-700"
              type="button"
            >
              New Meeting
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
