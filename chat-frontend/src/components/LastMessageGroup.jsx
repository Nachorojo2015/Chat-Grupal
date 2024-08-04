import { FaMicrophone } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { FaVideo } from "react-icons/fa";
import { useDarkModeStore } from "@/store/darkModeStore";

const Text = ({ username, message, name, darkMode }) => {
  return (
    <div className="text-ellipsis flex items-center w-[180px] text-sm whitespace-nowrap overflow-hidden">
      <p className={`${darkMode ? "text-white" : ""}`}>
        {name === username ? "Tú" : "~" + name}:
      </p>
      <span className={`ml-1 ${darkMode ? "text-white" : ""}`}>{message}</span>
    </div>
  );
};

const Audio = ({ username, name, darkMode }) => {
  return (
    <div className="flex items-center">
      <p className={`${darkMode ? "text-white" : ''}`}>{name === username ? "Tú" : "~" + name}:</p>
      <FaMicrophone className="ml-2" color={darkMode ? "white" : ''}/>
      <span className={`ml-1 ${darkMode ? "text-white" : ''}`}>Audio</span>
    </div>
  );
};

const File = ({ username, name, value, darkMode }) => {
  return (
    <div className="flex items-center">
      <p className={`${darkMode ? "text-white" : ''}`}>{name === username ? "Tú" : "~" + name}:</p>
      <FaFile className="ml-1" color={darkMode ? "white" : ''}/>
      <span className={`ml-1 text-sm uppercase ${darkMode ? "text-white" : ''}`}>{value.split(".")[1]}</span>
    </div>
  );
};

const Image = ({ username, name, darkMode }) => {
  return (
    <div className="flex items-center">
      <p className={`${darkMode ? "text-white" : ''}`}>{name === username ? "Tú" : "~" + name}:</p>
      <AiFillPicture className="ml-2" color={darkMode ? "white" : ''}/> <span className={`ml-1 ${darkMode ? "text-white" : ''}`}>Imagen</span>
    </div>
  );
};

const Video = ({ username, name, darkMode }) => {
  return (
    <div className="flex items-center">
      <p className={`${darkMode ? "text-white" : ''}`}>{name === username ? "Tú" : "~" + name}:</p>
      <FaVideo className="ml-2" color={darkMode ? "white" : ''}/> <span className={`ml-1 ${darkMode ? "text-white" : ''}`}>Video</span>
    </div>
  );
};

const LastMessageGroup = ({ lastMessageGroup, user }) => {
  const { darkMode } = useDarkModeStore((state) => ({
    darkMode: state.darkMode,
  }));

  if (!lastMessageGroup?.data) return null;

  const { typeMessage, name, value } = lastMessageGroup.data;

  if (typeMessage === "text") {
    return <Text username={user.username} message={value} name={name} darkMode={darkMode}/>;
  }

  if (typeMessage === "audio") {
    return <Audio username={user.username} name={name} darkMode={darkMode}/>;
  }

  if (typeMessage === "file") {
    return <File username={user.username} name={name} value={value} darkMode={darkMode}/>;
  }

  if (typeMessage === "image") {
    return <Image username={user.username} name={name} darkMode={darkMode}/>;
  }

  if (typeMessage === "video") {
    return <Video username={user.username} name={name} darkMode={darkMode}/>;
  }
};

export default LastMessageGroup;
