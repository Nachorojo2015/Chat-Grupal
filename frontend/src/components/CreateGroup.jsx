import { randomName } from "@/utils";
import { useRef, useState } from "react";
import { FaRegFileImage } from "react-icons/fa";

const CreateGroup = ({ socket, user }) => {
  const [urlPictureGroup, setUrlPictureGroup] = useState("");

  const pictureGroup = useRef(null);
  const nameOfGroup = useRef(null);

  function closeModal() {
    document.getElementById("modal-group").classList.add("hidden");
    document.getElementById("file-icon").classList.remove("hidden");
    document.getElementById("file-text").classList.remove("hidden");
    document.getElementById("picture-group").classList.add("hidden");
    document.getElementById("other-picture-text").classList.add("hidden");
  }

  function handlePicture() {
    pictureGroup.current.click();
  }

  function handlePictureSelected(event) {
    const file = event.target.files[0];
    const blobUrl = URL.createObjectURL(file);
    setUrlPictureGroup(blobUrl);
    document.getElementById("file-icon").classList.add("hidden");
    document.getElementById("file-text").classList.add("hidden");
    document.getElementById("picture-group").classList.remove("hidden");
    document.getElementById("other-picture-text").classList.remove("hidden");
  }

  async function createGroup() {
    if (!urlPictureGroup || !nameOfGroup.current.value)
      return alert("Debes completar los datos!");

    const photoFile = Object.values(pictureGroup.current.files)[0];
    const formData = new FormData();
    formData.append("photoGroup", photoFile);

    const name = randomName();
    const typePhotoFile = photoFile.name.split(".")[1];
    try {
      const response = await fetch(
        `http://localhost:8080/group/photo/${name}.${typePhotoFile}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data.status === "OK") {
        socket.emit("createGroup", {
          name: nameOfGroup.current.value,
          photo: `http://localhost:8080/uploads/groupPictures/${name}.${typePhotoFile}`,
          idUser: user._id,
        });
        alert("Grupo Creado!");
      }
    } catch (err) {
      console.log(err);
    }
    closeModal();
  }

  return (
    <div
      className="fixed hidden m-auto top-[10%] left-0 right-0 bg-slate-500 shadow text-white p-5 rounded-xl xl:w-[30%] w-[80%]"
      id="modal-group"
    >
      <div
        className="bg-slate-400 w-full text-center p-10 cursor-pointer"
        onClick={handlePicture}
      >
        <FaRegFileImage size={50} className="mx-auto" id="file-icon" />
        <p className="mt-3" id="file-text">
          Subir Imágen
        </p>
        <input
          type="file"
          accept=".jpg,.png,.webp"
          hidden
          ref={pictureGroup}
          onChange={handlePictureSelected}
        />
        <img
          src={urlPictureGroup}
          alt="group-picture-user"
          className="hidden w-[300px] h-[300px] mx-auto rounded-md"
          id="picture-group"
        />
        <p className="mt-2 hidden" id="other-picture-text">
          Pulsa para subir otra imágen
        </p>
      </div>
      <input
        type="text"
        placeholder="Nombre del grupo"
        className="block mt-3 p-2 rounded-md outline-none text-black"
        ref={nameOfGroup}
      ></input>
      <div className="flex justify-center gap-5 mt-5">
        <button onClick={closeModal}>Cancelar</button>
        <button
          className="bg-blue-600 p-3 rounded-md transition duration-150 hover:bg-opacity-50"
          onClick={createGroup}
        >
          Crear Grupo
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;
