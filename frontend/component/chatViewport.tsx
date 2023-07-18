import React from "react";

const ChatViewport = ({ messages }: any) => {
  console.log("This is inside chat viewport: " + [""]);
  //Check for unexpected JSON end of file input
  const parsedMessages = messages[0] !== "" ? JSON.parse(messages) : [];
  return (
    <div className="w-full h-full">
      {parsedMessages.map((msg: any, index: any) => (
        <ul key={index}>{msg}</ul>
      ))}
    </div>
  );
};

export default ChatViewport;
