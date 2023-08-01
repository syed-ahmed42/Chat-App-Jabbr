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
let fastContactData: any;

const ChatPage = () => {
  const [chatData, setChatData]: any = useState();
  const [messages, setMessages] = useState([""]);
  const [key, setKey] = useState(0);
  const [findUser, setFindUser] = useState("");
  const [testMessages, setTestMessages]: any = useState([]);
  const [contactStateData, setContactStateData]: any = useState();

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
    if (chatData !== undefined) {
      const setBeginningContactData = async () => {
        if (chatData !== undefined) {
          const startingContactData = await getContactsData(chatData.username);
          setContactStateData(startingContactData);
        }
      };
      setBeginningContactData();
    }
  }, [chatData]);

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

    socket.on("deleted message", async () => {
      console.log("Received socket request to delete message");
      if (curChatID !== "") {
        const updatedMessages = await getMessagesByChatID(curChatID);
        messageObjectArr = updatedMessages.data.messages;
        setTestMessages(messageObjectArr);
      }
    });

    socket.on("deleted chat", async () => {
      console.log("Received socket request to delete chat");
      await getContacts();
      messageObjectArr = [];
      setTestMessages([]);

      if (chatData !== undefined) {
        const preloadedContactData = await getContactsData(chatData.username);
        setContactStateData(preloadedContactData);
      }
    });

    socket.on("added chat", async () => {
      console.log("Received socket request to add chat");
      await getContacts();
      if (chatData !== undefined) {
        const preloadedContactData = await getContactsData(chatData.username);
        setContactStateData(preloadedContactData);
      }
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

    /*const setBeginningContactData = async () => {
      if (chatData !== undefined) {
        const startingContactData = await getContactsData(chatData.username);
        setContactStateData(startingContactData);
      }
    };
    setBeginningContactData();*/
  }, []);

  const [message, setMessage] = useState([""]);
  const router = useRouter();

  const getContactsData = async (username: any) => {
    const contactData = await axios({
      method: "post",
      url: "http://localhost:3000/api/v1/chat/getContacts",
      data: {
        username: username,
      },
    }).catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
    const tempArr = contactData.data.outcome;
    console.log("This is tempArr: " + JSON.stringify(tempArr));
    return tempArr;
  };

  const setContactVariables = async (username: any) => {
    const contactData = await getContactsData(username);
    setContactStateData(contactData);
    fastContactData = contactData;
  };

  const deleteChatOnDatabase = async (id: any) => {
    axios.defaults.withCredentials = true;
    await axios({
      method: "post",
      url: "http://localhost:3000/api/v1/chat/deleteChat",
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
    socket.emit("delete contact", curChatID);

    console.log("Chat has been deleted in database");
  };
  //Using useEffect so that io only gets called once
  const deleteMessageOnDatabase = async (
    id: any,
    chatID: any,
    msgObject: any
  ) => {
    axios.defaults.withCredentials = true;
    console.log("This is message id: " + id);
    console.log("This is message object: " + JSON.stringify(msgObject));
    await axios({
      method: "post",
      url: "http://localhost:3000/api/v1/chat/deleteMessage",
      data: {
        id: id,
        chatID: chatID,
      },
    }).catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
    socket.emit("delete message", curChatID);
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
          (objField: any) => objField.username === username
        )
      ) {
        const listOfMsgArr = chatData?.listOfChats[i].listOfMessages;
        curChatID = chatData?.listOfChats[i]._id;
        console.log("Changing cur chat id: " + curChatID);
        setCurChatStateID(curChatID);
        console.log("ChatID: " + curChatID);

        const msgContent = listOfMsgArr.map((msg: any) => msg.content);
        const msgObject = listOfMsgArr.map((msg: any) => ({
          ...msg,
          chatID: curChatID,
        }));
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

  const getMessages = async (chatID: any) => {
    const msgObject = await getMessagesByChatID(chatID);
    messageObjectArr = msgObject.data.messages;
    setTestMessages(messageObjectArr);
    curChatID = chatID;
    setCurChatStateID(chatID);
    console.log(
      "This is inside getMessages function, this is the messageObjectArr: " +
        JSON.stringify(messageObjectArr)
    );
  };

  const getMessagesByChatID = async (chatID: any) => {
    const myMessages = await axios({
      method: "post",
      url: "http://localhost:3000/api/v1/chat/getChatMessages",
      data: {
        chatID: chatID,
      },
    }).catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
    return myMessages;
  };

  const handleAddContact = async () => {
    axios.defaults.withCredentials = true;
    const chatCreationResponse = await axios({
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
    console.log(
      "This is post request outcome inside handleAddContact: " +
        chatCreationResponse
    );
    if (chatCreationResponse !== undefined) {
      socket.emit("add contact");
    }
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
          <Contacts
            key={key}
            chatID={curChatID}
            data={fastChatData}
            stateData={chatData}
            setContactVariables={setContactVariables}
            getContactsData={getContactsData}
            contactStateData={contactStateData}
            handleClick={getMessages}
            deleteChatOnDatabase={deleteChatOnDatabase}
          />
        )}
      </div>
      <div className="h-full w-full bg-cyan-500">
        <ChatViewport
          messages={testMessages}
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
