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
import Contacts from "./contacts";

const ChatPage = () => {
  const [contactData, setContactData] = useState();

  const getContacts = async () => {
    //This line sends cookies to the server
    axios.defaults.withCredentials = true;
    const res = await axios.get("http://localhost:3000/api/v1/chat/getChats");

    setContactData(res.data);
  };
  useEffect(() => {
    getContacts();
  }, []);
  if (contactData !== undefined) {
    console.log("This is contact data: " + contactData.username);
  }

  const [message, setMessage] = useState("");
  const router = useRouter();

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
      <div>{contactData !== undefined && <Contacts data={contactData} />}</div>
      <div className="h-full w-full bg-cyan-500"></div>
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
