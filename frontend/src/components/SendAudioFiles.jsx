import { useRef } from "react";
import { getTime } from "@/utils";
import { randomName } from "@/utils";

// Icono
import { FaFileAudio } from "react-icons/fa6";
import { useGroupStore } from "@/store/groupStore";

const SendAudioFiles = ({ socket, user, idGroup }) => {
  // Audio Input
  const audioRef = useRef(null);

  const handleAudioFiles = async () => {
    // Filas del Input Audio
    const [audioFile] = Object.values(audioRef.current.files);

    // Crear Formulario para subir la fila tipo audio
    const formData = new FormData();
    // Se carga
    formData.append("audio", audioFile);

    // Nombre random para la fila
    const name = randomName();
    // Tipo de audio
    const typeAudioFile = audioFile.name.split(".")[1];

    try {
      // Peticion al servidor
      const response = await fetch(
        `http://localhost:8080/audio/${name}.${typeAudioFile}`,
        {
          method: "POST",
          body: formData,
        }
      );

      // Llega la respuesta
      const data = await response.json();

      // Verificamos si la petición es correcta
      if (data.status === "OK") {
        const data = {
          photo: user.thumbnail,
          name: user.username,
          time: getTime(),
          typeMessage: "audio",
          value: `http://localhost:8080/uploads/audio/${name}.${typeAudioFile}`,
        };
        socket.emit("newMessage", { data, idGroup });
        socket.on("messages", (messages) => {
          useGroupStore.getState().setMessages(messages);
        });
      } else {
        alert("Error al subir el archivo");
      }
    } catch (error) {
      alert("Error en el servidor!");
    }
  };
  return (
    <label className="hvr-sweep-to-top items-center gap-2 cursor-pointer rounded-md p-1 transition-all duration-200">
      <FaFileAudio />
      Audio
      <input
        type="file"
        ref={audioRef}
        hidden
        onChange={handleAudioFiles}
        accept=".mp3,.flac,.ogg"
      />
    </label>
  );
};

export default SendAudioFiles;
