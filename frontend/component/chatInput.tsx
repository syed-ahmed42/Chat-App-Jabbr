import React, { useEffect } from "react";
import { useState, useRef } from "react";
import "../styles/chatInputStyles.css";

import useAutosizeTextArea from "./useAutosizeTextArea";

const ChatInput = ({ curChatID, pepsiClick }: any) => {
  const [userInput, setUserInput] = useState("");
  console.log("Inside chat input: " + curChatID);

  /*document.querySelectorAll("textArea.textArea").forEach((element) => {
    (element as HTMLTextAreaElement).style.height = `${element.scrollHeight}px`;
    element.addEventListener("input", (event) => {
      if (event.target !== null) {
        (event.target as HTMLTextAreaElement).style.height = "auto";

        (event.target as HTMLTextAreaElement).style.height = `${
          (event.target as HTMLTextAreaElement).scrollHeight
        }px`;
      }
    });
  });*/

  const [value, setValue] = useState("");
  const dummyAreaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(dummyAreaRef.current, textAreaRef.current, value);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setValue(val);
  };

  return (
    <>
      <div className="textAreaContainer">
        <textarea
          ref={textAreaRef}
          onChange={handleChange}
          className="textArea"
          rows={1}
          id="text"
          value={value}
        ></textarea>

        <div className="">
          <textarea
            ref={dummyAreaRef}
            onChange={handleChange}
            className="dummyArea"
            rows={1}
            id="dummy"
            value={value}
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
