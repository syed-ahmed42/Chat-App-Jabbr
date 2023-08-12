import { useEffect } from "react";

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
  dummyAreaRef: HTMLTextAreaElement | null,
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    if (dummyAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      console.log("<*---- I am inside change function ----*>");
      dummyAreaRef.style.height = "0px";
      const scrollHeight = dummyAreaRef.scrollHeight;
      console.log("This is scrollHeight: " + dummyAreaRef.scrollHeight);
      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.

      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [dummyAreaRef, value]);
};

export default useAutosizeTextArea;
