import React from "react";

const ChatViewport = ({ messages }: any) => {
  return (
    <div className="w-full h-full">
      {messages.map((message: any) => (
        <ul key={message}>{message}</ul>
      ))}
    </div>
  );
};

export default ChatViewport;
