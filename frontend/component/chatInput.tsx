import React, { useEffect } from "react";
import { useState } from "react";

const ChatInput = ({ curChatID, pepsiClick }: any) => {
  const [chatID, setChatID] = useState(curChatID);
  console.log("Inside chat input: " + chatID);
  useEffect(() => {
    setChatID(curChatID);
  }, [curChatID]);

  return (
    <>
      <input type="text" placeholder="Type something..." />
      <button
        onClick={() => pepsiClick(chatID, "Sending message through socket io")}
      >
        Click Me
      </button>
    </>
  );
};

export default ChatInput;
