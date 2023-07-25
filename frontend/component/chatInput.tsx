import React, { useEffect } from "react";
import { useState } from "react";

const ChatInput = ({ curChatID, pepsiClick }: any) => {
  const [userInput, setUserInput] = useState("");
  console.log("Inside chat input: " + curChatID);

  return (
    <>
      <input
        onChange={(e) => setUserInput(e.target.value)}
        type="text"
        placeholder="Type something..."
      />
      <button onClick={() => pepsiClick(curChatID, userInput)}>Click Me</button>
    </>
  );
};

export default ChatInput;
