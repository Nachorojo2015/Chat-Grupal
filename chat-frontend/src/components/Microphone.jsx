import { useGroupStore } from "@/store/groupStore";
import { getTime, randomName } from "@/utils";
import { useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const Microphone = ({ user, socket, idGroup, darkMode }) => {
  useEffect(() => {
    const containerPlayback = document.getElementById("container-playback");
    const playback = document.getElementById("playback");
    const micBtn = document.getElementById("mic");
    const deleteAudioBtn = document.getElementById("delete-audio-btn");
    const sendAudioBtn = document.getElementById("send-audio-btn");

    micBtn.addEventListener("click", toggleMic);

    let canRecord = false;
    let isRecording = false;
    let recorder = null;
    let chunks = [];

    function setupAudio() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            audio: true,
          })
          .then(setupStream)
          .catch((err) => {
            console.error(err);
          });
      }
    }

    setupAudio();

    function setupStream(stream) {
      recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        const audioUrl = window.URL.createObjectURL(blob);
        playback.src = audioUrl;
        canRecord = true;
        containerPlayback.classList.remove("hidden");
        containerPlayback.classList.add("flex");
        micBtn.classList.add("hidden");
      };

      canRecord = true; // Actualizar canRecord aquí
    }

    function toggleMic() {
      if (!canRecord || !recorder) return;

      isRecording = !isRecording;

      if (isRecording) {
        recorder.start();
      } else {
        recorder.stop();
      }
    }

    function deleteAudio() {
      playback.src = "";
      canRecord = true;
      containerPlayback.classList.add("hidden");
      micBtn.classList.remove("hidden");
    }

    async function sendAudio() {
      const audioSrc = playback.src;

      try {
        // Fecth al audio
        const response = await fetch(audioSrc);
        const blob = await response.blob();

        // Nombre random para la fila
        const name = randomName();

        // Crear una nueva fila
        const file = new File([blob], `${name}.mp3`, {
          type: "audio/mp3",
        });

        // Crear un input tipo fila para transferir el audio
        const inputFileAudio = document.createElement("input");
        inputFileAudio.type = "file";

        // Crear el data transfer para hacer la transferencia
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        inputFileAudio.files = dataTransfer.files;

        // Obtener la fila
        const audioFile = Object.values(inputFileAudio.files)[0];

        // Creamos formData para subir la fila
        const formData = new FormData();

        // Agregamos la fila
        formData.append("audio", audioFile);

        const res = await fetch(`http://localhost:8080/audio/${name}.mp3`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.status === "OK") {
          const data = {
            photo: user.thumbnail,
            name: user.username,
            time: getTime(),
            typeMessage: "audio",
            value: `http://localhost:8080/uploads/audio/${name}.mp3`,
          };
          socket.emit("newMessage", { idGroup, data });
          socket.on("messages", (messages) => {
            useGroupStore.getState().setMessages(messages);
          });
        } else {
          alert("Error el subir el audio");
        }
      } catch (err) {
        console.error("Error fetching audio:", err);
      }
      deleteAudio();
    }

    deleteAudioBtn.addEventListener("click", deleteAudio);
    sendAudioBtn.addEventListener("click", sendAudio);

    // Cleanup event listener on component unmount
    return () => {
      micBtn.removeEventListener("click", toggleMic);
    };
  }, [user, socket, idGroup]);

  return (
    <main>
      <div
        id="container-playback"
        className="hidden absolute right-0 -top-28 bg-zinc-600 rounded-md shadow p-5 justify-center gap-5 items-center"
      >
        <MdDelete id="delete-audio-btn" size={25} color="white" className="cursor-pointer" />
        <audio controls id="playback"></audio>
        <IoMdSend id="send-audio-btn" size={25} color="white" className="cursor-pointer" />
      </div>

      <FaMicrophone
        color={darkMode ? "white" : ""}
        className="cursor-pointer transition hover:opacity-75"
        id="mic"
      />
    </main>
  );
};

export default Microphone;
