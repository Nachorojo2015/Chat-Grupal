"use client";

import Link from "next/link";
import Toastify from "toastify-js";

export default function Register() {

    const analyseSecurityPassword = () => {
        const password = document.getElementById("password").value;
        const securityP = document.getElementById("security");
        let securityLevel = 0;
        if (password.length >= 8) {
          securityLevel++;
        }
        if (/[A-Z]/.test(password)) {
          securityLevel++;
        }
        if (/[a-z]/.test(password)) {
          securityLevel++;
        }
        if (/[0-9]/.test(password)) {
          securityLevel++;
        }
    
        if (securityLevel <= 2) {
          securityP.textContent = "Low Security";
        } else if (securityLevel === 3) {
          securityP.textContent = "Medium Security";
        } else {
          securityP.textContent = "High Security";
        }
      };

      async function register() {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("password-confirm").value;
        if (password !== confirmPassword) {
          Toastify({
            text: "Your passwords dont match",
            duration: 3000,
            style: {
              background: "linear-gradient(to right, #b30000, #ff3333)",
            },
          }).showToast();
          return;
        }
        try {
          const response = await fetch("http://localhost:8080/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
          });
          const data = await response.json();
          if (data.status) {
            console.log(data);
            Toastify({
              text: "Correct register",
              duration: 1000,
              style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
              },
            }).showToast();
            setTimeout(() => {
              window.location.href = "http://localhost:3000/login";
            }, 1500);
          } else {
            Toastify({
              text: "Error en registro",
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
    <>
      <div className="py-16 bg-white">
        <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
          <div
            className="hidden lg:block lg:w-1/2 bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
            }}
          ></div>
          <div className="w-full p-8 lg:w-1/2">
            <h2 className="text-2xl font-semibold text-gray-700 text-center">
              24hs Chat
            </h2>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <p className="text-xs text-center text-gray-500 uppercase">
                Register
              </p>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
                id="username"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="email"
                id="email"
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <p id="security" className="text-black"></p>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
                id="password"
                onChange={analyseSecurityPassword}
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password
                </label>
              </div>
              <input
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
                id="password-confirm"
              />
            </div>
            <div className="mt-8">
              <button
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
                id="register"
                onClick={register}
              >
                Sign Up
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 md:w-1/4"></span>
              <Link href={"/login"} className="text-xs text-gray-500 uppercase">
                or login
              </Link>
              <span className="border-b w-1/5 md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
