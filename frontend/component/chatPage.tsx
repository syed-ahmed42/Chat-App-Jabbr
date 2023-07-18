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
  const [chatData, setChatData]: any = useState();
  const [messages, setMessages] = useState([""]);
  const [curChatID, setCurChatID] = useState("");
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

  const [message, setMessage] = useState([""]);
  const router = useRouter();

  //Using useEffect so that io only gets called once

  const fetchMessages = (username: any) => {
    console.log("Fetching messages..." + username.contact);
    for (let i = 0; i < chatData?.listOfChats.length; i++) {
      if (
        chatData?.listOfChats[i].members.find(
          (e: any) => e.username === username.contact
        ) !== undefined
      ) {
        const listOfMsgArr = chatData?.listOfChats[i].listOfMessages;

        const msgContent = listOfMsgArr.map((msg: any) => msg.content);
        console.log(
          "This is the chat that should be fetched: " +
            JSON.stringify(msgContent)
        );
        setMessages([JSON.stringify(msgContent)]);
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

  const sendMessage = (chatID: any, msg: any) => {
    setMessages((prevMsgs) => [...prevMsgs, msg]);
    socket.emit("create room", chatData?.chatID);
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
        onChange={(e) =>
          setMessage((prevMsgs) => [...prevMsgs, e.target.value])
        }
      />
      <button onClick={() => sendMessage(message[0])}>Click Me</button>
    </div>
  );
};

export default ChatPage;
