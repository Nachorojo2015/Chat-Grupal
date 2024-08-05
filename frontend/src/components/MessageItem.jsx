import Link from "next/link";

// Iconos
import { FaFile } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useGroupStore } from "@/store/groupStore";

const Text = ({
  username,
  name,
  photo,
  time,
  value,
  darkMode,
  showTrash,
  hiddenTrash,
  deleteMessage,
  _id,
}) => {
  if (username !== name) {
    return (
      <div className="flex items-start gap-2.5">
        <img
          className="w-8 h-8 rounded-full cursor-pointer"
          src={photo}
          alt="Text-sended-for-User"
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-5 w-auto">
            <span
              className={`text-sm font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              ~{name}
            </span>
            <span
              className={`text-sm ${
                darkMode ? "text-white" : "text-black"
              } font-[600]`}
            >
              {time}
            </span>
          </div>
          <div className="flex flex-col p-4 border-gray-200 rounded-e-xl rounded-es-xl bg-gray-600">
            <p className="text-sm font-normal text-white inline-block">
              {value}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="flex ml-auto items-center gap-2.5"
        onMouseEnter={showTrash}
        onMouseLeave={hiddenTrash}
      >
        <FaTrash
          className="mt-5 hidden cursor-pointer"
          id={`trash-${_id}`}
          color={darkMode ? "white" : ""}
          onClick={deleteMessage}
        />
        <div className="flex flex-col gap-1 w-full max-w-[320px]">
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-[600] ml-auto ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              {time}
            </span>
          </div>
          <div className="flex flex-col leading-1.5 p-4 border-gray-200 rounded-l-lg rounded-b-lg bg-gray-700">
            <p className="text-sm font-normal text-white">{value}</p>
          </div>
        </div>
      </div>
    );
  }
};

const File = ({
  username,
  name,
  photo,
  time,
  value,
  darkMode,
  showTrash,
  hiddenTrash,
  deleteMessage,
  _id,
}) => {
  if (username !== name) {
    <div className="flex items-start gap-2.5">
      <img
        className="w-8 h-8 rounded-full cursor-pointer"
        src={photo}
        alt="File-sended-for-User"
      />
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            ~{name}
          </span>
          <span
            className={`text-sm ${
              darkMode ? "text-white" : "text-black"
            } font-[600]`}
          >
            {time}
          </span>
        </div>
        <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
          <div className="flex items-start bg-gray-50 dark:bg-gray-600 rounded-xl p-2">
            <div className="me-2">
              <span
                className={`flex items-center gap-2 text-sm font-medium ${
                  darkMode ? "text-white" : "text-gray-900"
                } pb-2`}
              >
                <FaFile />
                {value.split(".")[1].toUpperCase()}
              </span>
            </div>
            <div className="inline-flex self-center items-center">
              <button
                className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                type="button"
              >
                {value ? (
                  <Link href={value} target="_blank">
                    <FaDownload />
                  </Link>
                ) : (
                  <div className="loader"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
  } else {
    return (
      <div
        className="flex items-center gap-2.5 ml-auto"
        onMouseEnter={showTrash}
        onMouseLeave={hiddenTrash}
      >
        <FaTrash
          className="mt-5 hidden cursor-pointer"
          id={`trash-${_id}`}
          color={darkMode ? "white" : ""}
          onClick={deleteMessage}
        />
        <div className="flex flex-col gap-1">
          <div className="flex ml-auto items-center justify-between">
            <span
              className={`text-sm ml-auto ${
                darkMode ? "text-white" : "text-black"
              } font-[600]`}
            >
              {time}
            </span>
          </div>
          <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-l-lg rounded-b-lg dark:bg-gray-700">
            <div className="flex items-start bg-gray-50 dark:bg-gray-600 rounded-xl p-2">
              <div className="me-2">
                <span
                  className={`flex items-center gap-2 text-sm font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  } dark:text-white pb-2`}
                >
                  <FaFile size={20} />
                  {value.split(".")[1].toUpperCase()}
                </span>
              </div>
              <div className="inline-flex self-center items-center">
                <button
                  className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                  type="button"
                >
                  {value ? (
                    <Link href={value} target="_blank">
                      <FaDownload />
                    </Link>
                  ) : (
                    <div className="loader"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const Audio = ({
  username,
  name,
  photo,
  time,
  value,
  darkMode,
  showTrash,
  hiddenTrash,
  deleteMessage,
  _id,
}) => {
  if (username !== name) {
    return (
      <div className="flex items-start gap-2.5">
        <img
          className="w-8 h-8 rounded-full cursor-pointer"
          src={photo}
          alt="Audio-sended-for-User"
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              ~{name}
            </span>
            <span
              className={`text-sm ${
                darkMode ? "text-white" : "text-black"
              } font-[600]`}
            >
              {time}
            </span>
          </div>
          <div className="flex flex-col w-full max-w-[320px] leading-1.5 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {value ? (
                <audio src={value} controls></audio>
              ) : (
                <div className="loader"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="flex items-center gap-2.5 ml-auto"
        onMouseEnter={showTrash}
        onMouseLeave={hiddenTrash}
      >
        <FaTrash
          className="mt-5 hidden cursor-pointer"
          id={`trash-${_id}`}
          color={darkMode ? "white" : ""}
          onClick={deleteMessage}
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span
              className={`text-sm ml-auto ${
                darkMode ? "text-white" : "text-black"
              } font-[600]`}
            >
              {time}
            </span>
          </div>
          <div className="flex flex-col w-full max-w-[320px] leading-1.5 border-gray-200 rounded-l-lg rounded-b-lg">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {value ? (
                <audio src={value} controls></audio>
              ) : (
                <div className="loader"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const Image = ({
  username,
  name,
  photo,
  time,
  value,
  darkMode,
  showTrash,
  hiddenTrash,
  deleteMessage,
  _id,
}) => {
  if (username !== name) {
    return (
      <div className="flex items-start gap-2.5">
        <img
          className="h-8 w-8 rounded-full cursor-pointer"
          src={photo}
          alt="Photo-sended-for-User"
        />
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              ~{name}
            </span>
            <span
              className={`text-sm ${
                darkMode ? "text-white" : "text-black"
              } font-[600]`}
            >
              {time}
            </span>
          </div>
          <div className="leading-1.5 flex w-full max-w-[320px] flex-col">
            <div className="group relative mt-2">
              <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <button
                  data-tooltip-target="download-image"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
                >
                  {value ? (
                    <Link href={value} target="_blank">
                      <FaDownload />
                    </Link>
                  ) : (
                    <div className="loader"></div>
                  )}
                </button>
                <div
                  id="download-image"
                  role="tooltip"
                  className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  Download image
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              </div>
              {value ? (
                <img src={value} className="rounded-lg" />
              ) : (
                <div className="loader"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="flex items-center gap-2.5 ml-auto"
        onMouseEnter={showTrash}
        onMouseLeave={hiddenTrash}
      >
        <FaTrash
          className="mt-5 hidden cursor-pointer"
          id={`trash-${_id}`}
          color={darkMode ? "white" : ""}
          onClick={deleteMessage}
        />
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span
              className={`text-sm ml-auto ${
                darkMode ? "text-white" : "text-black"
              } font-[600]`}
            >
              {time}
            </span>
          </div>
          <div className="leading-1.5 flex w-full max-w-[320px] flex-col">
            <div className="group relative mt-2">
              <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <button
                  data-tooltip-target="download-image"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50"
                >
                  {value ? (
                    <Link href={value} target="_blank">
                      <FaDownload />
                    </Link>
                  ) : (
                    <div className="loader"></div>
                  )}
                </button>
                <div
                  id="download-image"
                  role="tooltip"
                  className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  Download image
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              </div>
              {value ? (
                <img src={value} className="rounded-lg" />
              ) : (
                <div className="loader"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const Video = ({
  username,
  name,
  photo,
  time,
  value,
  darkMode,
  showTrash,
  hiddenTrash,
  deleteMessage,
  _id,
}) => {
  if (username !== name) {
    return (
      <div className="flex items-start gap-2.5">
        <img
          className="h-8 w-8 rounded-full cursor-pointer"
          src={photo}
          alt="Video-sended-for-User"
        />
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              ~{name}
            </span>
            <span
              className={`text-sm ${
                darkMode ? "text-white" : "text-black"
              } font-[600]`}
            >
              {time}
            </span>
          </div>
          <div className="leading-1.5 flex w-full max-w-[320px] flex-col">
            <div className="group relative mt-2">
              <video src={value} controls className="rounded-lg"></video>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="flex items-center gap-2.5 ml-auto"
        onMouseEnter={showTrash}
        onMouseLeave={hiddenTrash}
      >
        <FaTrash
          className="mt-5 hidden cursor-pointer"
          id={`trash-${_id}`}
          color={darkMode ? "white" : ""}
          onClick={deleteMessage}
        />
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span
              className={`text-sm ml-auto ${
                darkMode ? "text-white" : "text-black"
              } font-[600]`}
            >
              {time}
            </span>
          </div>
          <div className="leading-1.5 flex w-full max-w-[320px] flex-col">
            <div className="group relative mt-2">
              <video src={value} controls className="rounded-lg"></video>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const MessageItem = ({ message, user, socket, darkMode, idGroup }) => {
  const { _id } = message;
  const { photo, name, time, typeMessage, value } = message.data;
  const { username } = user;

  function showTrash() {
    document.getElementById(`trash-${_id}`).classList.remove("hidden");
  }

  function hiddenTrash() {
    document.getElementById(`trash-${_id}`).classList.add("hidden");
  }

  function deleteMessage() {
    socket.emit("deleteMessage", { idGroup, idMessage: _id });
    socket.on("messages", (messages) => {
      useGroupStore.getState().setMessages(messages);
    });
  }

  if (typeMessage === "text") {
    return (
      <Text
        username={username}
        name={name}
        photo={photo}
        time={time}
        value={value}
        darkMode={darkMode}
        showTrash={showTrash}
        hiddenTrash={hiddenTrash}
        deleteMessage={deleteMessage}
        _id={_id}
      />
    );
  }

  if (typeMessage === "file") {
    return (
      <File
        username={username}
        name={name}
        photo={photo}
        time={time}
        value={value}
        darkMode={darkMode}
        showTrash={showTrash}
        hiddenTrash={hiddenTrash}
        deleteMessage={deleteMessage}
        _id={_id}
      />
    );
  }

  if (typeMessage === "audio") {
    return (
      <Audio
        username={username}
        name={name}
        photo={photo}
        time={time}
        value={value}
        darkMode={darkMode}
        showTrash={showTrash}
        hiddenTrash={hiddenTrash}
        deleteMessage={deleteMessage}
        _id={_id}
      />
    );
  }

  if (typeMessage === "image") {
    return (
      <Image
        username={username}
        name={name}
        photo={photo}
        time={time}
        value={value}
        darkMode={darkMode}
        showTrash={showTrash}
        hiddenTrash={hiddenTrash}
        deleteMessage={deleteMessage}
        _id={_id}
      />
    );
  }

  if (typeMessage === "video") {
    return (
      <Video
        username={username}
        name={name}
        photo={photo}
        time={time}
        value={value}
        darkMode={darkMode}
        showTrash={showTrash}
        hiddenTrash={hiddenTrash}
        deleteMessage={deleteMessage}
        _id={_id}
      />
    );
  }
};

export default MessageItem;
