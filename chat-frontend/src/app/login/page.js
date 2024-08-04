"use client";

import Link from "next/link";
import Toastify from "toastify-js";
import { FiGithub } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";

export default function Login() {

    async function login() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
          const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (data.status) {
            console.log(data);
            Toastify({
              text: "Correct Login",
              duration: 1000,
              style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
              },
            }).showToast();
            localStorage.setItem("token", data.token);
            setTimeout(() => {
              window.location.href = "http://localhost:3000/";
            }, 1500);
          } else {
            Toastify({
              text: "Error en login",
              duration: 3000,
              style: {
                background: "linear-gradient(to right, #b30000, #ff3333)",
              },
            }).showToast();
          }
        } catch (err) {
          console.log(err);
          Toastify({
            text: "Error en servidor",
            duration: 3000,
            style: {
              background: "linear-gradient(to right, #b30000, #ff3333)",
            },
          }).showToast();
        }
      }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
      <div className="relative py-3 mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 -rotate-6 rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-black">Login</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 leading-6 space-y-4 text-gray-700 text-lg ">
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Email Address
                  </label>
                </div>
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type="password"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <button
                    className="bg-cyan-500 text-white rounded-md px-2 py-1 w-full transition-all duration-150 hover:opacity-50"
                    id="submit"
                    onClick={login}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 justify-center">
            <button
              className="flex items-center bg-black text-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium transition-all duration-150 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={() => {
                const popup = window.open(
                  "http://localhost:8080/auth/github",
                  "targetWindow",
                  `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=620,height=700`
                );
                window.addEventListener("message", (e) => {
                  if (e.origin === "http://localhost:8080") {
                    if (e.data) {
                      const { token } = JSON.parse(e.data);
                      console.log(token);
                      localStorage.setItem("token", token);
                      popup.close();
                      setTimeout(() => {
                        window.location.href = "http://localhost:3000/";
                      }, 1000);
                    }
                  }
                });
              }}
            >
              <FiGithub size={20}/>
              <span className="ml-3">Continue with Github</span>
            </button>
            <button
              className="flex items-center bg-[#7289da] text-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium transition-all duration-150 hover:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={() => {
                const popup = window.open(
                  "http://localhost:8080/auth/discord",
                  "targetWindow",
                  `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=620,height=700`
                );
                window.addEventListener("message", (e) => {
                  if (e.origin === "http://localhost:8080") {
                    if (e.data) {
                      const { token } = JSON.parse(e.data);
                      localStorage.setItem("token", token);
                      popup.close();
                      setTimeout(() => {
                        window.location.href = "http://localhost:3000";
                      }, 1000);
                    }
                  }
                });
              }}
            >
              <FaDiscord size={20}/>
              <span className="ml-3">Continue with Discord</span>
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <Link href={"/register"} className="text-xs text-gray-500 uppercase">
              or signup
            </Link>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
