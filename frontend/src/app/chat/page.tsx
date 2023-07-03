"use client";
import React from "react";
import { io } from "socket.io-client";
import { useEffect } from "react";

let socket: any;

const chat = () => {
  useEffect(() => {
    socket = io("http://localhost:3000");
  });
  return (
    <div className="h-full w-full">
      <input type="text" placeholder="Search" />
      <div className="bg-cyan-200 h-full w-full">Place to chat</div>
      <input type="text" placeholder="Type something..." />
      <button>Click Me</button>
    </div>
  );
};

export default chat;
