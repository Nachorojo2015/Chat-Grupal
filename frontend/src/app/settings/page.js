"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoIosHome } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { FaLightbulb } from "react-icons/fa";
import { useDarkModeStore } from "@/store/darkModeStore";

export default function Settings() {
  const [user, setUser] = useState({});
  const [urlImage, setUrlImage] = useState("");
  const turnDarkMode = useDarkModeStore((state) => state.turn);
  const { darkMode } = useDarkModeStore((state) => ({
    darkMode: state.darkMode,
  }));

  async function getDataUser() {
    try {
      const response = await fetch(`http://localhost:8080/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.status) {
        console.log(data);
        setUser(data.user);
      } else {
        alert("Error to get data user");
        window.location.href = "http://localhost:3000/login";
      }
    } catch (err) {
      console.log(err);
      alert("User not found!");
      window.location.href = "http://localhost:3000/login";
    }
  }

  async function changeImageUser() {
    if (urlImage.length === 0) {
      alert("Debes indicar una URL");
    } else {
      try {
        const response = await fetch(
          `http://localhost:8080/picture/${user._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: urlImage }),
          }
        );
        const data = await response.json();
        if (data.status) {
          alert("Imagen cambiada correctamente");
          window.location.reload();
        } else {
          alert("Error al cambiar la imagen");
        }
      } catch (err) {
        console.log(err);
        alert("Error al cambiar imagen");
      }
    }
  }

  useEffect(() => {
    getDataUser();
  }, []);

  return (
    <>
      <section className={`transition flex ${darkMode ? "bg-black" : "bg-white"} flex-col justify-center items-center text-center h-screen gap-3`}>
        <div className="flex items-center gap-5">
          <Link
            href={"/"}
          >
            <IoIosHome size={30} color={`${darkMode ? "white" : ""}`} className="cursor-pointer transition hover:text-blue-500 mt-5"/>
          </Link>
          {darkMode ? (
            <FaLightbulb
              size={30}
              onClick={turnDarkMode}
              color={`white`}
              className="cursor-pointer transition hover:text-zinc-600 mt-5"
            />
          ) : (
            <MdDarkMode
              size={30}
              onClick={turnDarkMode}
              className="cursor-pointer transition hover:text-zinc-600 mt-5"
            />
          )}
        </div>
        <div className="relative">
          <img
            src={user?.thumbnail}
            className="w-[300px] h-[300px] align-middle rounded-full cursor-pointer transition-all duration-150 hover:border-[5px] hover:border-green-500"
            onClick={() =>
              document.getElementById("pictureUser").classList.remove("hidden")
            }
          ></img>
        </div>
        <div className="w-[500px]">
          <p className="border rounded-full p-1 bg-black text-white">
            {user?.username}
          </p>
          <p className="border rounded-full p-1 bg-black text-white mt-2">
            {user?.email}
          </p>
        </div>
      </section>
      <div
        className="mx-auto fixed right-0 left-0 top-[10%] bg-gray-300 shadow-lg w-[500px] h-[520px] rounded-md hidden"
        id="pictureUser"
      >
        <MdCancel
          onClick={() =>
            document.getElementById("pictureUser").classList.add("hidden")
          }
          size={20}
          className="cursor-pointer m-1"
        />
        <img
          src={urlImage}
          className="w-[300px] h-[300px] mx-auto rounded-md"
        ></img>
        <input
          type="text"
          placeholder="Ingrese URL de la imagen"
          className="block border shadow mx-auto w-[90%] mt-12 pl-2 p-2"
          onChange={(e) => setUrlImage(e.target.value)}
        ></input>
        <button
          className="p-2 bg-blue-500 rounded-xl shadow text-white mt-5 block mx-auto transition-all duration-200 hover:opacity-70"
          onClick={changeImageUser}
        >
          Cambiar Imagen
        </button>
      </div>
    </>
  );
}
