import React, { useState } from "react";
import { socket } from "./socket";
import { useEffect, useRef } from "react";
import "../styles/messageStyles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const ChatViewport = ({
  messages,
  curChatID,
  chatData,
  messageObject,
  deleteMessageOnDatabase,
}: any) => {
  const [viewportMessages, setViewportMessages] = useState([]);
  const [showContent, setShowContent] = useState(false);

  //Scroll to bottom behaviour
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current &&
      messagesEndRef.current.scrollIntoView({
        behavior: "instant",
        block: "nearest",
        inline: "start",
      });
  };

  useEffect(() => {
    console.log("UseEffect triggered in chatViewport");
    setShowContent(false);
    setTimeout(() => {
      setShowContent(true);
    }, 50);
  }, []);

  useEffect(() => {
    setViewportMessages(messageObject);
    setShowContent(false);
    setTimeout(() => {
      setShowContent(true);
    }, 50);
    console.log("These are the viewport messages: " + viewportMessages);
    console.log(
      "This is the name of the sender (found within chatViewport): " +
        viewportMessages
    );
  }, [messages, messageObject]);
  console.log(
    "This is inside chat viewport: " + JSON.stringify(viewportMessages)
  );
  //Check for unexpected JSON end of file input
  //messages = JSON.stringify(viewportMessages);
  //const parsedMessages = viewportMessages;
  //const parsedMessages =
  //viewportMessages[0] !== "" ? JSON.parse(viewportMessages) : [];
  const deleteMessageOnClientSide = (index: any) => {
    const newMessages = viewportMessages.filter((_, i) => i !== index);
    setViewportMessages(newMessages);
  };

  scrollToBottom();

  return (
    <div
      className={
        showContent
          ? "chatViewportContainer "
          : "chatViewportContainer makeChatInvisible"
      }
    >
      {viewportMessages.map((msg: any, index: any) => (
        <div key={index}>
          <div className="messageWrapper">
            <ul>
              <div className="messageContainerStyle">
                <div className="messageMetadataStyle">
                  <div className="senderStyle">{msg.sender.username}</div>
                  <div className="timestampStyle">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="messageContentStyle">{msg.content}</div>
              </div>
            </ul>

            <div className="deleteMessageButtonContainer">
              <button
                className="deleteMessageButtonStyle"
                onClick={() => {
                  deleteMessageOnDatabase(msg._id, msg.chatID, msg);
                  deleteMessageOnClientSide(index);
                }}
              >
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
            </div>
          </div>
          <div ref={messagesEndRef} />
        </div>
      ))}
    </div>
  );
};

export default ChatViewport;
