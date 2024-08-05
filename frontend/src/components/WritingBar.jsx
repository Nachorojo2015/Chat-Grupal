import { useRef, useState } from "react";
import Microphone from "./Microphone";
import { getTime } from "@/utils";

// Icono
import { IoSend } from "react-icons/io5";
import { useGroupStore } from "@/store/groupStore";

const WritingBar = ({ socket, user, idGroup, darkMode }) => {
  const inputMessage = useRef(null);
  const [message, setMessage] = useState("");
  const [showSendMessage, setShowSendMessage] = useState(false);

  function sendMessage(e) {
    if (e.key === "Enter") {
      if (message.length !== 0 && message.split('').filter(c => c !== '\n').length !== 0) {
        const data = {
          photo: user.thumbnail,
          name: user.username,
          time: getTime(),
          typeMessage: "text",
          value: message,
        };
        // Enviar Mensaje al servidor
        socket.emit("newMessage", { data, idGroup });
        socket.on("messages", (messages) => {
          useGroupStore.getState().setMessages(messages);
        });
        document.getElementById("message").blur();
        document.getElementById("message").value = "";
        setMessage("");
        setShowSendMessage(false);
      } else {
        return;
      }
    }
  }

  function isWriting() {
    setMessage(inputMessage.current.value);
    if (inputMessage.current.value.length > 0) {
      setShowSendMessage(true);
    } else {
      setShowSendMessage(false);
    }
  }

  
  return (
    <>
      <textarea
        className={`w-[90%] outline-none overflow-hidden h-5 bg-transparent border-b resize-none text-sm ${darkMode ? "text-white" : ''}`}
        placeholder="Escribe un mensaje"
        ref={inputMessage}
        onKeyDown={sendMessage}
        onChange={isWriting}
        id="message"
      ></textarea>
      <div className="absolute right-2 top-3">
        {showSendMessage ? (
          <IoSend size={20} className="cursor-pointer" onClick={sendMessage} color={darkMode ? "white" : ''}/>
        ) : (
          <Microphone user={user} socket={socket} idGroup={idGroup} darkMode={darkMode}/>
        )}
      </div>
    </>
  );
};

export default WritingBar;
