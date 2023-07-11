"use client";
import React from "react";
import { redirect } from "next/navigation";
import { io } from "socket.io-client";
import { socket } from "./socket";
import withAuth from "./withAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MongoClient } from "mongodb";

const ChatPage = () => {
  const isLoggedIn = true;
  const [message, setMessage] = useState("");
  const router = useRouter();

  if (!isLoggedIn) {
    redirect("/login");
  }
  //Using useEffect so that io only gets called once

  function sendMessage(msg: string) {
    socket.emit("chat message", msg);
  }

  const handleLogOut = async () => {
    axios.defaults.withCredentials = true;
    await axios
      .post("http://localhost:3000/api/v1/auth/logout", {
        withCredentials: true,
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        console.log(err.response);
      });
    router.replace("/login");
  };

  return (
    <div className="h-full w-full">
      <input type="text" placeholder="Search" />
      <button onClick={() => handleLogOut()} className="bg-orange-400">
        Log out
      </button>
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
