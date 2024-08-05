import React, { useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { MdEmojiEmotions } from "react-icons/md";

const Emoji = ({darkMode}) => {
  // EMOJI PICKER
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(null);

  return (
    <>
      <div
        onClick={() => {
          document.getElementById("extras-chat").classList.add("invisible");
          setIsPickerVisible(!isPickerVisible);
        }}
      >
        <MdEmojiEmotions size={20} className="cursor-pointer" color={darkMode ? "white" : ''} />
      </div>
      <div className={isPickerVisible ? "absolute bottom-11 left-0" : "hidden"}>
        <Picker
          data={data}
          previewPosition="none"
          onEmojiSelect={(e) => {
            document.getElementById("message").value += e.native;
            setCurrentEmoji(e.native);
            setIsPickerVisible(!isPickerVisible);
          }}
        />
      </div>
    </>
  );
};

export default Emoji;
