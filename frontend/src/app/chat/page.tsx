import React from "react";
import ChatPage from "../../../component/chatPage";
import RedirectFromChat from "../../../utils/redirectFromChat";
import RedirectFromLogin from "../../../utils/redirectFromChat";

const Chat = () => {
  return (
    <RedirectFromChat >
      <ChatPage />
    </RedirectFromChat>
  );
};

export default Chat;
