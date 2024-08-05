import { useRef } from "react";
import { getTime } from "@/utils";
import { randomName } from "@/utils";

// Iconos
import { AiFillPicture } from "react-icons/ai";
import { useGroupStore } from "@/store/groupStore";

const MediaFiles = ({ socket, user, idGroup }) => {
  // Photos or audio
  const photoOrVideoRef = useRef(null);

  const handlePhotoOrVideo = () => {
    document.getElementById("extras-chat").classList.add("invisible");
    photoOrVideoRef.current.click();
  };

  const handlePhotoOrVideoSelected = async () => {
    const photosOrVideosFiles = Object.values(photoOrVideoRef.current.files)[0];

    // Crear formData para subir la fila
    const formData = new FormData();
    // Se carga la fila
    formData.append("media", photosOrVideosFiles);

    // Generar nombre random para la fila
    const name = randomName();
    // Identificar extensión de fila
    const typeMediaFile = photosOrVideosFiles.name.split(".")[1];

    try {
      // Enviar petición al servidor
      const response = await fetch(
        `http://localhost:8080/images-videos/${name}.${typeMediaFile}`,
        {
          method: "POST",
          body: formData,
        }
      );

      // Llega la respuesta
      const data = await response.json();

      // Se verifica si la respuesta es correcta
      if (data.status === "OK") {
        const data = {
          photo: user.thumbnail,
          name: user.username,
          time: getTime(),
          typeMessage: "jpg webp gif png".includes(typeMediaFile)
            ? "image"
            : "video",
          value: `http://localhost:8080/uploads/media/${name}.${typeMediaFile}`,
        };
        socket.emit("newMessage", {data, idGroup});
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
      onClick={handlePhotoOrVideo}
    >
      <AiFillPicture />
      Photos or videos
      <input
        type="file"
        ref={photoOrVideoRef}
        className="hidden"
        onChange={handlePhotoOrVideoSelected}
        accept=".jpg,.png,.gif,.webp,.mp4"
      />
    </p>
  );
};

export default MediaFiles;