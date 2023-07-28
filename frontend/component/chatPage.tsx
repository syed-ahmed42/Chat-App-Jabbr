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
import ChatInput from "./chatInput";
let curChatID: any = "";
let fastMessagesArr: any = [""];
let messageObjectArr: any = [];
let fastChatData: any;

const ChatPage = () => {
  const [chatData, setChatData]: any = useState();
  const [messages, setMessages] = useState([""]);
  const [key, setKey] = useState(0);
  const [findUser, setFindUser] = useState("");

  const [curChatStateID, setCurChatStateID] = useState("");
  const getContacts = async () => {
    //This line sends cookies to the server
    axios.defaults.withCredentials = true;
    const res = await axios.get("http://localhost:3000/api/v1/chat/getChats");

    setChatData(res.data);
    fastChatData = res.data;
  };

  useEffect(() => {
    getContacts();
  }, [curChatStateID]);

  useEffect(() => {
    socket.on("receive message", (msg) => {
      console.log(
        "Message received. The current client is currently viewing chat with chatID: " +
          curChatID
      );
      //MsgObject has format
      //{content: ..., chatID: ..., sender: ...}
      const msgObject = JSON.parse(msg);
      console.log("This is msgObject chatID: " + msgObject.chatID);
      if (msgObject.chatID === curChatID) {
        setMessages((prevArr) => [...prevArr, msgObject.content]);
        messageObjectArr.push(msgObject);
        fastMessagesArr.push(msgObject.content);
      }
      getContacts();
      console.log(
        "This is the updated message state after receipt of message: " +
          messages
      );
      /*if (curChatID !== "") {
        console.log(msg + " Sent to chat id: " + curChatID);
      }*/
    });
  }, [socket]);

  useEffect(() => {
    console.log("CLIENT SIDE: Joining room with ID: " + curChatID);
    socket.emit("join room", curChatStateID);
  }, [curChatStateID]);
  if (chatData !== undefined) {
    console.log("This is contact data: " + chatData.username);
  }

  useEffect(() => {
    socket.on("connection", () => {
      console.log("Connected on the client side");
    });
  }, []);

  const [message, setMessage] = useState([""]);
  const router = useRouter();

  //Using useEffect so that io only gets called once
  const deleteMessageOnDatabase = async (id: any) => {
    axios.defaults.withCredentials = true;
    await axios({
      method: "post",
      url: "http://localhost:3000/api/v1/chat/deleteMessage",
      data: {
        id: id,
      },
    }).catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
    console.log("Message has been deleted in database");
  };
  const fetchMessages = async (username: any) => {
    console.log("Fetching messages..." + JSON.stringify(username));
    /*console.log(
      "Members data: " + JSON.stringify(chatData?.listOfChats[0].members)
    );
    console.log(
      "Checking whether list of chats includes Jane: " +
        chatData?.listOfChats[0].members.some(
          (objField: any) => objField.username === "Jane"
        )
    );*/
    //console.log("ChatID: " + chatData?.listOfChats[0]._id);
    for (let i = 0; i < chatData?.listOfChats.length; i++) {
      if (
        chatData?.listOfChats[i].members.some(
          (objField: any) => objField.username === chatData.username
        ) &&
        chatData?.listOfChats[i].members.some(
          (objField: any) => objField.username === username.contact
        )
      ) {
        const listOfMsgArr = chatData?.listOfChats[i].listOfMessages;
        curChatID = chatData?.listOfChats[i]._id;
        console.log("Changing cur chat id: " + curChatID);
        setCurChatStateID(curChatID);
        console.log("ChatID: " + curChatID);

        const msgContent = listOfMsgArr.map((msg: any) => msg.content);
        const msgObject = listOfMsgArr.map((msg: any) => msg);
        /*console.log(
          "This is the chat that should be fetched: " +
            JSON.stringify(msgContent)
        );*/
        setMessages(msgContent);
        messageObjectArr = msgObject;
        fastMessagesArr = msgContent;
        console.log("This is fastMessagesArr: " + fastMessagesArr);
        break;
      }
    }
    console.log(messages);
  };
  const handleAddContact = async () => {
    axios.defaults.withCredentials = true;
    await axios({
      method: "post",
      url: "http://localhost:3000/api/v1/chat/createChat",
      data: {
        username: findUser,
      },
    }).catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
    await getContacts();
    setKey((key) => key + 1);
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
    setMessages([""]);
    messageObjectArr = [];
    fastMessagesArr = [""];
    router.replace("/login");
  };

  const sendMessage = (chatID: any, msg: any) => {
    if (chatID === "") {
      console.log("ERROR: ChatID is empty string");
    }
    if (chatID !== "") {
      socket.emit("send message", chatID, msg, chatData.username);
    }
  };

  return (
    <div className="h-full w-full">
      <input
        onChange={(e) => setFindUser(e.target.value)}
        type="text"
        placeholder="Search"
      />
      <button onClick={() => handleAddContact()} className="bg-green-400">
        Add Contact
      </button>
      <button onClick={() => handleLogOut()} className="bg-orange-400">
        Log out
      </button>
      <div>
        {chatData !== undefined && (
          <Contacts key={key} data={fastChatData} handleClick={fetchMessages} />
        )}
      </div>
      <div className="h-full w-full bg-cyan-500">
        <ChatViewport
          messages={fastMessagesArr}
          curChatID={curChatID}
          chatData={fastChatData}
          messageObject={messageObjectArr}
          deleteMessageOnDatabase={deleteMessageOnDatabase}
        />
      </div>
      <ChatInput pepsiClick={sendMessage} curChatID={curChatID} />
    </div>
  );
};

export default ChatPage;
