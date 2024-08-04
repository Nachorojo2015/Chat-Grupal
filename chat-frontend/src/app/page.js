"use client";

import User from "@/components/User";
import MenuChats from "@/components/MenuChats";
import Chat from "@/components/Chat";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import CreateGroup from "@/components/CreateGroup";
import Groups from "@/components/Groups";
import { useGroupStore } from "@/store/groupStore";

export default function Home() {
  const [socket, setSocket] = useState(io("http://localhost:8080/"));
  const [user, setUser] = useState({});

  async function getDataUser() {
    try {
      const response = await fetch(`http://localhost:8080/auth/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.status) {
        setUser(data.user);
      } else {
        Swal.fire("Sesión expirada");
        window.location.href = "http://localhost:3000/login";
      }
    } catch (err) {
      Swal.fire("Inicia Sesión");
      window.location.href = "http://localhost:3000/login";
    }
  }

  useEffect(() => {
    getDataUser();
  }, []);

  useEffect(() => {
    socket.on("messages", (messages) => {
      useGroupStore.getState().setMessages(messages);
    });
  }, [socket]);

  return (
    <main className="grid h-dvh xl:grid-cols-[5%,25%,70%] grid-cols-[0%,100%,0%]" id="main-container">
      {/* User  Profile */}
      <User user={user} />
      {/* _____________ */}

      {/* Chats Menu */}
      <MenuChats user={user} socket={socket} />
      {/* ________ */}

      {/* Chat */}
      <Chat user={user} socket={socket} />
      {/* _______ */}

      {/* Grupos para hablar */}
      <Groups user={user} socket={socket} />
      {/* --------- */}

      {/* Modal para crear grupo */}
      <CreateGroup socket={socket} user={user} />
      {/* ----------------------- */}
    </main>
  );
}
