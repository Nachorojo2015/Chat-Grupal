import MessageItem from "./MessageItem";
import Emoji from "./Emoji";
import Camera from "./Camera";
import { useGroupStore } from "@/store/groupStore";
import WritingBar from "./WritingBar";
import Extras from "./Extras";
import { useDarkModeStore } from "@/store/darkModeStore";
import { SlOptionsVertical } from "react-icons/sl";

const Chat = ({ user, socket }) => {
  // Datos del grupo
  const { idGroup, photo, name, messages, admin } = useGroupStore((state) => ({
    idGroup: state.idGroup,
    photo: state.photo,
    name: state.name,
    messages: state.messages,
    admin: state.admin,
  }));

  const { darkMode } = useDarkModeStore((state) => ({
    darkMode: state.darkMode,
  }));

  function showGroupItem() {
    document.getElementById("group-item").classList.toggle("hidden");
  }

  // Abandonar un grupo
  function leaveGroup() {
    socket.emit("leaveGroup", { idGroup, idUser: user._id });
  }

  return (
    <section className="flex-col items-center relative hidden" id="chat">
      {/* Cabeza del chat. Muestra los datos del grupo */}
      <header
        className={`flex justify-between w-full items-center gap-5 p-3 ${
          darkMode ? "bg-black" : "bg-white"
        } bg-opacity-90`}
      >
        <div className="flex items-center gap-3">
          <img
            src={photo}
            alt="photo-group"
            className="w-[50px] h-[50px] rounded-full"
          />
          <p className={`font-bold ${darkMode ? "text-white" : ""}`}>{name}</p>
        </div>
        {admin === user._id ? (
          ""
        ) : (
          <div className="relative">
            <SlOptionsVertical
              className="cursor-pointer"
              onClick={showGroupItem}
              color={darkMode ? "white" : ""}
            />
            <div className="absolute right-6 top-0 hidden" id="group-item">
              <button
                onClick={leaveGroup}
                className="text-sm bg-red-500 text-white p-2 rounded-md text-nowrap transition hover:bg-opacity-75"
              >
                Abandonar grupo
              </button>
            </div>
          </div>
        )}
      </header>
      {/*  Mensajes del grupo */}
      <section
        className={`flex-1 w-full relative ${
          darkMode ? "bg-black" : ""
        } border-t bg-opacity-90`}
      >
        <Camera user={user} socket={socket} idGroup={idGroup} />
        <div className="overflow-y-scroll gap-5 overflow-x-hidden flex flex-col h-[90%] py-3 pr-5 absolute top-0  right-0 w-full">
          {messages.map((message, index) => (
            <MessageItem
              message={message}
              user={user}
              socket={socket}
              darkMode={darkMode}
              idGroup={idGroup}
              key={index}
            />
          ))}
        </div>
      </section>
      {/* Barra para enviar mensajes */}
      <footer
        className={`flex items-center absolute bottom-0 gap-5 p-3 w-full`}
      >
        <Emoji darkMode={darkMode} />
        <Extras
          socket={socket}
          user={user}
          idGroup={idGroup}
          darkMode={darkMode}
        />
        <WritingBar
          socket={socket}
          user={user}
          idGroup={idGroup}
          darkMode={darkMode}
        />
      </footer>
    </section>
  );
};

export default Chat;
