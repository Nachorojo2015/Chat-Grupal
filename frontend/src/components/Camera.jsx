import { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { FaCameraRetro } from "react-icons/fa";
import { MdOutlineChangeCircle } from "react-icons/md";
import { FaRecordVinyl } from "react-icons/fa";
import { FaStopCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { useCameraStore } from "@/store/cameraStore";
import { getTime, randomName } from "@/utils";
import { useGroupStore } from "@/store/groupStore";

const Camera = ({ user, socket, idGroup }) => {
  const onCamera = useCameraStore((state) => state.onCamera);
  const turnCamera = useCameraStore((state) => state.turn);

  const [imageSrc, setImageSrc] = useState(null);
  const webCamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [capturing, setCapturing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [recorderChunks, setRecorderChunks] = useState([]);

  function capture() {
    const imageSrc = webCamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    document.getElementById("webcam").classList.add("invisible");
    document.getElementById("tools-webcam").classList.add("invisible");
  }

  function changeCamera() {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  }

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webCamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );

    mediaRecorderRef.current.start();
  }, [webCamRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecorderChunks((prev) => prev.concat(data));
      }
    },
    [setRecorderChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    document.getElementById("webcam").classList.add("invisible");
    document.getElementById("tools-webcam").classList.add("invisible");
  });

  function clearPicture() {
    setImageSrc(null);
    document.getElementById("webcam").classList.remove("invisible");
    document.getElementById("tools-webcam").classList.remove("invisible");
  }

  function clearVideo() {
    setRecorderChunks([]);
    document.getElementById("webcam").classList.remove("invisible");
    document.getElementById("tools-webcam").classList.remove("invisible");
  }

  async function sendPicture() {
    if (imageSrc) {
      try {
        // Fetch la imagen desde la URL
        const response = await fetch(imageSrc);
        const blob = await response.blob();

        // Nombre random para la fila
        const name = randomName();

        // Crea un objeto File a partir del Blob
        const file = new File([blob], `${name}.jpg`, { type: blob.type });

        // Crea un input de tipo file y asigna el archivo
        const input = document.createElement("input");
        input.type = "file";

        // Crea un DataTransfer para simular la selección del archivo
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;

        // Obtenemos la fila
        const pictureFile = Object.values(input.files)[0];

        // Creamos un form data para pasar los datos
        const formData = new FormData();

        // Cargamos la fila
        formData.append("media", pictureFile);

        const res = await fetch(
          `http://localhost:8080/images-videos/${name}.jpg`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();

        if (data.status === "OK") {
          const data = {
            photo: user.thumbnail,
            name: user.username,
            time: getTime(),
            typeMessage: "image",
            value: `http://localhost:8080/uploads/media/${name}.jpg`,
          };

          socket.emit("newMessage", { data, idGroup });
          socket.on("messages", (messages) => {
            useGroupStore.getState().setMessages(messages);
          });
        }
        clearPicture();
        turnCamera();
      } catch (err) {
        alert("Error en el servidor!");
      }
    }
  }

  async function sendVideo() {
    if (recorderChunks.length > 0) {
      // Crear un Blob a partir de los chunks del video
      const blob = new Blob(recorderChunks, { type: "video/mp4" });

      // Nombre random para la fila
      const name = randomName();

      // Crear un objeto File a partir del Blob
      const videoFile = new File([blob], `${randomName}.mp4`, {
        type: "video/mp4",
      });

      // Crear un nuevo input de tipo file
      const input = document.createElement("input");
      input.type = "file";

      // Crear un DataTransfer para poder manipular los archivos del input
      const dataTransfer = new DataTransfer();

      // Añadir el archivo al DataTransfer
      dataTransfer.items.add(videoFile);

      // Asignar los archivos del DataTransfer al input
      input.files = dataTransfer.files;

      // Obtenemos la fila
      const fileVideo = Object.values(input.files)[0];

      // Creamos formData para subir la fila
      const formData = new FormData();

      // Agregamos la fila al form
      formData.append("media", fileVideo);

      try {
        const response = await fetch(
          `http://localhost:8080/images-videos/${name}.mp4`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.status === "OK") {
          const data = {
            photo: user.thumbnail,
            name: user.username,
            time: getTime(),
            typeMessage: "video",
            value: `http://localhost:8080/uploads/media/${name}.mp4`,
          };

          socket.emit("newMessage", { data, idGroup });
          socket.on("messages", (messages) => {
            useGroupStore.getState().setMessages(messages);
          });
        }

        clearVideo();
        turnCamera();
      } catch (err) {
        alert("Error en el servidor!")
      }
    }
  }

  return (
    <>
      {onCamera ? (
        <>
          <Webcam
            audio={false}
            height={360}
            width={720}
            screenshotFormat="image/png"
            className="absolute z-40 left-[15%] top-[11%] border-[11px] border-neutral-500"
            ref={webCamRef}
            videoConstraints={{
              facingMode: facingMode,
            }}
            id="webcam"
          />

          {/* Buttons Tools Camera */}
          <div
            className="flex absolute bg-zinc-800 w-[720px] p-2 left-[15%] bottom-[8%] z-[70] justify-center gap-12"
            id="tools-webcam"
          >
            {/* Take Photo Button */}
            <button onClick={capture} className="transition hover:opacity-70">
              <FaCameraRetro size={25} color="white" />
            </button>

            {/* Change Camera Button */}
            <button
              onClick={changeCamera}
              className="transition hover:opacity-70"
            >
              <MdOutlineChangeCircle size={30} color="white" />
            </button>

            {/* Rec */}
            {capturing ? (
              // Stop Video Button
              <button
                onClick={handleStopCaptureClick}
                className="transition hover:opacity-70"
              >
                <FaStopCircle size={30} color="white" />
              </button>
            ) : (
              // Start Video Button
              <button
                onClick={handleStartCaptureClick}
                className="transition hover:opacity-70"
              >
                <FaRecordVinyl size={25} color="white" />
              </button>
            )}

            {/* Close Camera Button */}
            <button
              onClick={() => turnCamera()}
              className="transition hover:opacity-70"
            >
              <MdCancel size={30} color="white" />
            </button>
          </div>
          <div>
            {/* Picture */}
            {imageSrc && (
              <img
                src={imageSrc}
                alt="pick-user"
                className="absolute z-40 left-[15%] top-[11%] w-[720px] object-cover border-[5px]"
              />
            )}
            {/* Tools Picture */}
            <div
              className={`flex absolute bg-zinc-800 p-2 w-[720px] left-[15%] bottom-[9%] ${
                recorderChunks.length > 0 ? "z-50" : "z-[60]"
              } justify-center gap-24`}
            >
              {imageSrc && (
                <>
                  {/* Delete Picture */}
                  <FaTrash
                    size={25}
                    color="white"
                    onClick={clearPicture}
                    className="cursor-pointer transition hover:opacity-70"
                  />
                  {/* Send Picture */}
                  <IoMdSend
                    size={25}
                    color="white"
                    onClick={sendPicture}
                    className="cursor-pointer transition hover:opacity-70"
                  />
                </>
              )}
            </div>
            {/* Video Camera */}
            {recorderChunks.length > 0 && (
              <video
                controls
                height={360}
                width={720}
                className="absolute z-40 left-[15%] top-[11%] border-[6px]"
              >
                <source
                  src={URL.createObjectURL(
                    new Blob(recorderChunks, { type: "video/webm" })
                  )}
                />
              </video>
            )}
            <div
              className={`flex absolute bg-zinc-800 w-[720px] p-2 left-[15%] bottom-[9%] ${
                imageSrc ? "z-50" : "z-[60]"
              } justify-center gap-24`}
            >
              {recorderChunks.length > 0 && (
                <>
                  <FaTrash
                    size={25}
                    color="white"
                    onClick={clearVideo}
                    className="cursor-pointer transition hover:opacity-70"
                  />

                  <IoMdSend
                    size={25}
                    color="white"
                    onClick={sendVideo}
                    className="cursor-pointer transition hover:opacity-70"
                  />
                </>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Camera;
