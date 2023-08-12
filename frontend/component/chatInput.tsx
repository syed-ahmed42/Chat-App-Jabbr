import React, { useEffect } from "react";
import { useState } from "react";
import "../styles/chatInputStyles.css";

const ChatInput = ({ curChatID, pepsiClick }: any) => {
  const [userInput, setUserInput] = useState("");
  console.log("Inside chat input: " + curChatID);

  return (
    <>
      <input
        onChange={(e) => setUserInput(e.target.value)}
        type="text"
        value={userInput}
        placeholder="Message"
        className="chatInputBox"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            pepsiClick(curChatID, userInput);
            setUserInput("");
          }
        }}
      />
    </>
  );
};

export default ChatInput;
