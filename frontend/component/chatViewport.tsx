import React, { useState } from "react";
import { socket } from "./socket";
import { useEffect } from "react";

const ChatViewport = ({
  messages,
  curChatID,
  chatData,
  messageObject,
  deleteMessageOnDatabase,
}: any) => {
  const [viewportMessages, setViewportMessages] = useState([]);
  useEffect(() => {
    setViewportMessages(messageObject);
  }, [messageObject]);
  console.log("This is inside chat viewport: " + viewportMessages);
  //Check for unexpected JSON end of file input
  //messages = JSON.stringify(viewportMessages);
  //const parsedMessages = viewportMessages;
  //const parsedMessages =
  //viewportMessages[0] !== "" ? JSON.parse(viewportMessages) : [];
  const deleteMessageOnClientSide = (index: any) => {
    const newMessages = viewportMessages.filter((_, i) => i !== index);
    setViewportMessages(newMessages);
  };

  return (
    <div className="w-full h-full overflow-auto">
      {viewportMessages.map((msg: any, index: any) => (
        <div key={index}>
          <ul>{msg.content}</ul>
          <button
            className="bg-yellow-500"
            onClick={() => {
              deleteMessageOnDatabase(msg._id, msg.chatID, msg);
              deleteMessageOnClientSide(index);
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChatViewport;
