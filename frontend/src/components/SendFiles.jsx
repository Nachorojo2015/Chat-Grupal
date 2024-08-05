import { useRef } from "react";
import { getTime } from "@/utils";
import { randomName } from "@/utils";

// Iconos
import { SiFiles } from "react-icons/si";
import { useGroupStore } from "@/store/groupStore";

const Files = ({ socket, user, idGroup }) => {
  const fileInputRef = useRef(null);

  const handleFileInput = () => {
    document.getElementById("extras-chat").classList.add("invisible");
    fileInputRef.current.click();
  };

  const handleFilesSelected = async () => {
    const file = Object.values(fileInputRef.current.files)[0];
    console.log(file);

    // Se crea un formData para subir la fila
    const formData = new FormData();

    // Se adjunta la fila
    formData.append("document", file);

    // Se crear nombre random para la fila
    const name = randomName();
    // Se obtiene la extensión de la fila
    const typeFile = file.name.split(".")[1];
    try {
      // Se realiza una petición al servidor
      const response = await fetch(
        `http://localhost:8080/files/${name}.${typeFile}`,
        {
          method: "POST",
          body: formData,
        }
      );

      // Se obtiene la respuesta
      const data = await response.json();

      // Verificamos que la respuesta sea correcta
      if (data.status === "OK") {
        const data = {
          photo: user.thumbnail,
          name: user.username,
          time: getTime(),
          typeMessage: "file",
          value: `http://localhost:8080/uploads/documents/${name}.${typeFile}`,
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
    <p
      className="hvr-sweep-to-top items-center gap-2 cursor-pointer rounded-md p-1 transition-all duration-200"
      onClick={handleFileInput}
    >
      <SiFiles />
      Files
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFilesSelected}
        accept=".pdf,.doc,.docx,.txt"
      />
    </p>
  );
};

export default Files;
