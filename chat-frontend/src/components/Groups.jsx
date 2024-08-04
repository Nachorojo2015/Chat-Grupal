import { useDarkModeStore } from "@/store/darkModeStore";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

const Groups = ({ user, socket }) => {
  // Estados
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);

  const { darkMode } = useDarkModeStore((state) => ({
    darkMode: state.darkMode,
  }));

  // Sockets. Lado del Cliente
  useEffect(() => {
    socket.on("groups", (data) => {
      if (data) {
        console.log(data);
        setGroups(
          data.filter((group) =>
            group.users.every((u) => u["user"] !== user._id)
          )
        );
        setMyGroups(
          data.filter((group) => group.users[0]?.user === user._id)
        );
        setAllGroups(data);
      }
    });
  }, [user, socket]);

  // Funciones

  // Unirse a un grupo
  async function joinGroup(e) {
    const idGroup = e.target.id;
    socket.emit("joinGroup", { idGroup, idUser: user._id });
  }

  // Eliminar un grupo
  function deleteGroup(e) {
    const idGroup = e.target.id;
    socket.emit("deleteGroup", { idGroup });
  }

  return (
    <section
      className={`flex flex-col ${
        darkMode ? "bg-black" : "bg-zinc-100"
      } bg-opacity-90`}
      id="groups"
    >
      {allGroups.length > 0 ? (
        <>
          <p
            className={`font-bold text-xl ml-1 p-2 ${
              darkMode ? "text-white" : ""
            }`}
          >
            {myGroups.length > 0
              ? "Tus Grupos"
              : "No tienes nigún grupo creado"}
          </p>
          <section className="p-2 grid xl:grid-cols-3 grid-cols-1 justify-cemter gap-5 overflow-auto">
            {myGroups.map((group, index) => (
              <div
                className={`${
                  darkMode ? "bg-black" : "bg-white"
                } rounded-md shadow h-[350px] bg-opacity-70`}
                key={index}
              >
                <img
                  src={group.photo}
                  alt="photo-group"
                  className="h-[200px] w-full rounded-t-md"
                />
                <div className="px-3 mt-3">
                  <p className={`font-bold ${darkMode ? "text-white" : ""}`}>
                    {group.name}
                  </p>
                  <p
                    className={`flex items-center gap-1 mt-2 ${
                      darkMode ? "text-white" : ""
                    }`}
                  >
                    <FaUser color={darkMode ? "white" : ""} />:{" "}
                    {group.users.length}
                  </p>
                  {group.users[0]?.user === user._id ? (
                    <button
                      className="p-2 rounded-md font-bold bg-red-500 mt-5 w-full text-white transition duration-150 hover:bg-opacity-50"
                      onClick={deleteGroup}
                      id={group._id}
                    >
                      Eliminar Grupo
                    </button>
                  ) : (
                    <button
                      className="p-2 rounded-md font-bold bg-zinc-200 mt-5 w-full transition duration-150 hover:bg-opacity-50"
                      onClick={joinGroup}
                      id={group._id}
                    >
                      Unirse al Grupo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>
          {groups.length > 0 ? (
            <p className="font-bold text-xl ml-1">Otros Grupos</p>
          ) : (
            <p className={`ml-2 p-2 ${darkMode ? "text-white" : ""}`}>
              No hay más grupos en este momento
            </p>
          )}
          <section className="p-2 grid grid-cols-3 justify-cemter gap-5">
            {groups.map((group, index) => (
              <div
                className={`${
                  darkMode ? "bg-black" : "bg-white"
                } rounded-md shadow h-[350px] bg-opacity-70`}
                key={index}
              >
                <img
                  src={group.photo}
                  alt="photo-group"
                  className="h-[200px] w-full rounded-t-md"
                />
                <div className="px-3 mt-3">
                  <p className={`font-bold ${darkMode ? "text-white" : ""}`}>
                    {group.name}
                  </p>
                  <p
                    className={`flex items-center gap-1 mt-2 ${
                      darkMode ? "text-white" : ""
                    }`}
                  >
                    <FaUser color={darkMode ? "white" : ""} />:{" "}
                    {group.users.length}
                  </p>
                  {group.users[0]?.user === user._id ? (
                    <button
                      className="p-2 rounded-md font-bold bg-red-500 mt-5 w-full text-white transition duration-150 hover:bg-opacity-50"
                      onClick={deleteGroup}
                      id={group._id}
                    >
                      Eliminar Grupo
                    </button>
                  ) : (
                    <button
                      className="p-2 rounded-md font-bold bg-zinc-200 mt-5 w-full transition duration-150 hover:bg-opacity-50"
                      onClick={joinGroup}
                      id={group._id}
                    >
                      Unirse al Grupo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>
        </>
      ) : (
        <div className="loader"></div>
      )}
    </section>
  );
};

export default Groups;
