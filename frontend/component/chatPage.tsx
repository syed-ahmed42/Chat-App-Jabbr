"use client";
import React from "react";
import { redirect } from "next/navigation";
import { io } from "socket.io-client";
import { socket } from "./socket";
import withAuth from "./withAuth";
import { useEffect, useState } from "react";

const ChatPage = () => {
  const isLoggedIn = true;
  const [message, setMessage] = useState("");

  if (!isLoggedIn) {
    redirect("/login");
  }
  //Using useEffect so that io only gets called once

  function sendMessage(msg: string) {
    socket.emit("chat message", msg);
  }

  return (
    <div className="h-full w-full">
      <input type="text" placeholder="Search" />
      <div className="h-full w-full bg-cyan-500">Place to chat</div>
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={() => sendMessage(message)}>Click Me</button>
    </div>
  );
};

export default ChatPage;
