"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function Home() {
  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("message", (message) => {
      console.log("Message from server:", message);
    });

    // return () => socket.disconnect();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      hello
    </main>
  );
}
