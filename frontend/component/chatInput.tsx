import React, { useEffect } from "react";
import { useState, useRef } from "react";
import "../styles/chatInputStyles.css";

import useAutosizeTextArea from "./useAutosizeTextArea";
import $ from "jquery";

const ChatInput = ({ curChatID, pepsiClick }: any) => {
  const [userInput, setUserInput] = useState("");
  console.log("Inside chat input: " + curChatID);
  const MAXCHARS = 200;
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
  const dummyAreaRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLDivElement>(null);

  useAutosizeTextArea(dummyAreaRef.current, textAreaRef.current, value);

  useEffect(() => {
    console.log("This is value: " + value);
    /*if ($(".textArea").text().length > 3) {
      console.log("This text is too big: " + $(".textArea").text());
      $(".textArea").text(value.slice(0, 4));
    }*/
  }, [value]);

  $("[contenteditable]").focusout(function () {
    var element = $(this);
    if (!element.text().trim().length) {
      element.empty();
    }
  });

  $(".textArea").on("input click", function () {
    if (this.innerText.toString().length == 0) {
      this.innerHTML = "&nbsp;";
    }
  });
  $(".textArea").on("keydown propertychange", function (event) {
    $("span").text("Total chars:" + $(this).text().length);
    let boolean = !(event.ctrlKey && event.keyCode == 65);
    console.log("This is boolean inside chatInput: " + boolean);
    if ($(this).text().length === MAXCHARS && event.keyCode != 8) {
      event.preventDefault();
    }
  });

  /*$(".textArea").on("input", function (e) {
    if ($(".textArea").text().length > MAXCHARS && e.keyCode !== 8) {
      console.log("TOO BIG");
      e.preventDefault();
      $(".textArea").text(
        $(".textArea")
          .text()
          .substring(0, MAXCHARS + 1)
      );
    }
  });*/

  const handleChange = (evt: React.ChangeEvent<HTMLDivElement>) => {
    const val = evt.target.getAttribute("data-value");
    if (val !== null) {
      //console.log("This is the value inside chatInput: " + val);
      setValue(val);
    }
  };

  const clearTextBox = (
    dummyAreaRef: HTMLDivElement | null,
    textAreaRef: HTMLDivElement | null
  ) => {
    if (textAreaRef && dummyAreaRef) {
      textAreaRef.innerHTML = "";
      dummyAreaRef.innerHTML = "";
      setValue("");
    }
  };

  return (
    <>
      <div className="textAreaContainer">
        <div
          contentEditable="plaintext-only"
          suppressContentEditableWarning={true}
          placeholder="Message"
          ref={textAreaRef}
          onInput={(e) => {
            if (e.currentTarget.textContent !== null) {
              const stuff = e.currentTarget.textContent.toString();
              stuff.replace(/^\s+|\s+$/g, "");
              stuff.replace(/(\r\n|\n|\r)/gm, "");
              const bait =
                stuff.charCodeAt(0).toString(16) === "a" &&
                stuff.charCodeAt(1).toString(16) === "a";
              console.log("This is stuff: " + value);
              if (!bait) {
                setValue(stuff);
              }
            }
          }}
          className="textArea"
          id="text"
          data-value={value}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              //console.log("This is the value: " + value + "hotdog");
              pepsiClick(curChatID, value);
              //clearTextBox(dummyAreaRef.current, textAreaRef.current);
              $(".textArea").empty();
              $(".textArea").addClass(".textArea");
              setTimeout(() => setValue(""), 100);
            }
          }}
        ></div>

        <div className="">
          <div
            contentEditable="plaintext-only"
            suppressContentEditableWarning={true}
            ref={dummyAreaRef}
            onInput={(e) => {
              if (e.currentTarget.textContent !== null) {
                const stuff = e.currentTarget.textContent.toString();
                stuff.replace(/^\s+|\s+$/g, "");
                stuff.replace(/(\r\n|\n|\r)/gm, "");
                const bait =
                  stuff.charCodeAt(0).toString(16) === "a" &&
                  stuff.charCodeAt(1).toString(16) === "a";
                console.log("This is stuff: " + bait);
                if (!bait) {
                  setValue(stuff);
                }
              }
            }}
            className="dummyArea"
            id="dummy"
            data-value={value}
          >
            {value}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
