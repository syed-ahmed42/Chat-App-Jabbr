import React, { useState } from "react";
import { socket } from "./socket";
import { useEffect } from "react";

const ChatViewport = ({ messages, curChatID, chatData }: any) => {
  const [viewportMessages, setViewportMessages] = useState([""]);
  useEffect(() => {
    setViewportMessages(messages);
  }, [messages]);
  console.log("This is inside chat viewport: " + viewportMessages);
  //Check for unexpected JSON end of file input
  //messages = JSON.stringify(viewportMessages);
  //const parsedMessages = viewportMessages;
  //const parsedMessages =
  //viewportMessages[0] !== "" ? JSON.parse(viewportMessages) : [];
  return (
    <div className="w-full h-full overflow-auto">
      {viewportMessages.map((msg: any, index: any) => (
        <ul key={index}>{msg}</ul>
      ))}
    </div>
  );
};

export default ChatViewport;
