import { useEffect, useState } from "react";
import LastMessageGroup from "./LastMessageGroup";
import { useGroupStore } from "@/store/groupStore";

// Iconos
import { FaUsers } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { useDarkModeStore } from "@/store/darkModeStore";

const MenuChats = ({ user, socket }) => {
  const [unitedGroups, setUnitedGroups] = useState([]);
  // Copia de reespaldo de los grupos donde el usuario esta unido
  const [allUnitedGroups, setAllUnitedGroups] = useState([]);

  const { darkMode } = useDarkModeStore((state) => ({
    darkMode: state.darkMode,
  }));

  useEffect(() => {
    socket.on("groups", (data) => {
      if (data) {
        const groupsUnited = data.filter((group) =>
          group.users.some((u) => u["user"] === user._id)
        );
        setUnitedGroups(groupsUnited);
        setAllUnitedGroups(groupsUnited);
      }
    });
  }, [user, socket]);

  // Mostrar cartel para crear un grupo
  function showModalForCreateGroup() {
    document.getElementById("modal-group").classList.remove("hidden");
  }

  // Abir el chat
  function openChat(e) {
    const idGroup = e.currentTarget.id;
    const group = unitedGroups.find((g) => g._id === idGroup);
    useGroupStore
      .getState()
      .setGroup(idGroup, group.photo, group.name, group.messages, group.users[0].user);

    document.getElementById("groups").classList.add("hidden");
    document.getElementById("chat").classList.remove("hidden");
    document.getElementById("chat").classList.add("flex");
    document.getElementById("new-group-item").classList.add("hidden");
    document.getElementById("main-container").classList.remove("grid-cols-[0%,100%,0%]");
    document.getElementById("main-container").classList.add("grid-cols-[0%,0%,100%]")
  }

  // Filtrar grupos por nombre
  function filterGroupsByName(e) {
    const nameGroup = e.target.value.toLowerCase();
    if (nameGroup.length === 0) {
      setUnitedGroups(allUnitedGroups);
    } else {
      setUnitedGroups(
        unitedGroups.filter((group) =>
          group.name.toLowerCase().includes(nameGroup)
        )
      );
    }
  }

  return (
    <section
      className={`${
        darkMode ? "bg-black" : "bg-white"
      } bg-opacity-95 flex flex-col border-r`}
    >
      <div className="flex items-center gap-5 p-[22px]">
        <FaUsers size={30} color={darkMode ? "white" : ""} />
        <div>
          <p
            className={`font-bold text-[20px] ${darkMode ? "text-white" : ""}`}
          >
            Grupos
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3" id="new-group-item">
          <p className={`font-[600] ${darkMode ? "text-white" : ""}`}>
            Nuevo grupo:
          </p>
          <button
            className="px-2 pb-1 bg-blue-500 rounded-md text-white transition duration-150 hover:bg-opacity-70"
            onClick={showModalForCreateGroup}
          >
            +
          </button>
        </div>
      </div>
      <div className="border-b border-t py-5 relative px-2">
        <input
          type="text"
          placeholder="Search"
          className={`outline-none border-b bg-transparent indent-10 p-1 w-full ${
            darkMode ? "text-white caret-white border-white" : "border-black"
          } `}
          onChange={filterGroupsByName}
        />
        <CiSearch
          color={darkMode ? "white" : ""}
          size={20}
          className="absolute bottom-[27px] left-5"
        />
      </div>
      {/* Grupos */}
      <section className="overflow-y-auto mx-auto overflow-x-hidden p-5 flex flex-col w-full space-y-5">
        {unitedGroups.length > 0 ? (
          unitedGroups.map((group, index) => (
            <article
              onClick={openChat}
              id={group._id}
              key={index}
              className="flex items-center w-full cursor-pointer justify-between transition hover:opacity-50 overflow-hidden"
            >
              <div className="flex items-center gap-5">
                <img
                  src={group.photo}
                  alt="photo-group"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex justify-between items-center">
                    <p className={`font-bold ${darkMode ? "text-white" : ""}`}>
                      {group.name}
                    </p>
                    <p className={`text-sm ${darkMode ? "text-white" : ""}`}>
                      {group.messages.slice(-1)[0]?.data?.time}
                    </p>
                  </div>
                  <LastMessageGroup
                    lastMessageGroup={group.messages.slice(-1)[0]}
                    user={user}
                  />
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="loader"></div>
        )}
      </section>
      {/* _______ */}
    </section>
  );
};

export default MenuChats;
