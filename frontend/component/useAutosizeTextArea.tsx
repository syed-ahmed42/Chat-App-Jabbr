import { useEffect } from "react";

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
  dummyAreaRef: HTMLDivElement | null,
  textAreaRef: HTMLDivElement | null,
  value: string
) => {
  useEffect(() => {
    if (dummyAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      console.log("<*---- I am inside change function ----*>");
      dummyAreaRef.style.height = "0px";
      const scrollHeight = dummyAreaRef.scrollHeight;
      console.log(
        "This is dummyAreaScrollHeight: " + dummyAreaRef.scrollHeight
      );
      console.log(
        "This is textAreaScrollHeight before: " + textAreaRef.scrollHeight
      );
      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.

      textAreaRef.style.height = scrollHeight + "px";
      console.log(
        "This is textAreaStyleHeight after: " + textAreaRef.style.height
      );
    }
  }, [dummyAreaRef, value]);
};

export default useAutosizeTextArea;
