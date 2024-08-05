import SendAudioFiles from "./SendAudioFiles";
import SendMediaFiles from "./SendMediaFiles";
import SendFiles from "./SendFiles";
import { useCameraStore } from "@/store/cameraStore";

// Iconos
import { FaPlusCircle } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";

const Extras = ({ socket, user, idGroup, darkMode }) => {
  const isOnCamera = useCameraStore((state) => state.onCamera);

  function onCamera() {
    document.getElementById("extras-chat").classList.toggle("invisible");
    useCameraStore.getState().turn((state) => state.turn);
  }

  function openToolsChat() {
    document.getElementById("extras-chat").classList.toggle("invisible");
  }
  return (
    <>
      <div
        className={`${isOnCamera ? "pointer-events-none" : ""}`}
        onClick={openToolsChat}
      >
        <FaPlusCircle size={19} className="cursor-pointer" color={darkMode ? "white" : ''}/>
      </div>
      <div
        className="flex flex-col gap-2 absolute bottom-14 left-0 bg-black text-white rounded-lg p-2 invisible"
        id="extras-chat"
      >
        <SendMediaFiles socket={socket} user={user} idGroup={idGroup}/>
        <SendAudioFiles socket={socket} user={user} idGroup={idGroup} />
        <p
          onClick={onCamera}
          className="hvr-sweep-to-top items-center gap-2 cursor-pointer rounded-md p-1 transition-all duration-200"
        >
          <FaCamera />
          Camera
        </p>
        <SendFiles socket={socket} user={user} idGroup={idGroup}/>
      </div>
    </>
  );
};

export default Extras;
