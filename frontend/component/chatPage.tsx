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
import ChatViewport from "./chatViewport";

const ChatPage = () => {
  const [chatData, setChatData] = useState();
  const [messages, setMessages] = useState([""]);
  const getContacts = async () => {
    //This line sends cookies to the server
    axios.defaults.withCredentials = true;
    const res = await axios.get("http://localhost:3000/api/v1/chat/getChats");

    setChatData(res.data);
  };

  useEffect(() => {
    getContacts();
  }, []);
  if (chatData !== undefined) {
    console.log("This is contact data: " + chatData.username);
  }

  const [message, setMessage] = useState("");
  const router = useRouter();

  //Using useEffect so that io only gets called once

  function sendMessage(msg: string) {
    socket.emit("chat message", msg);
  }

  const fetchMessages = (username: string) => {
    console.log("Fetching messages..." + username.contact);
    for (let i = 0; i < chatData?.listOfChats.length; i++) {
      if (
        chatData?.listOfChats[i].members.find(
          (e) => e.username === username.contact
        ) !== undefined
      ) {
        console.log(
          "This is the chat that should be fetched: " +
            JSON.stringify(chatData?.listOfChats[i].listOfMessages)
        );
        setMessages([JSON.stringify(chatData?.listOfChats[i].listOfMessages)]);
        break;
      }
    }
    console.log(messages);
  };

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
      <div>
        {chatData !== undefined && (
          <Contacts data={chatData} handleClick={fetchMessages} />
        )}
      </div>
      <div className="h-full w-full bg-cyan-500">
        <ChatViewport messages={messages} />
      </div>
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
