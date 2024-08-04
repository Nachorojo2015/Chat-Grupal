// Libraries
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import compression from "express-compression";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import setupSocketServer from "./src/server/socket.js"
import http from "http";
import "./src/auth/auth.js";


// Session Router AUTH
import { sessionRouter } from "./src/routes/session.js";
import { filesRouter } from "./src/routes/files.js";
import { userRouter } from "./src/routes/user.js";


// Configuración del dotenv
dotenv.config();

// Variables
const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/uploads", express.static("uploads"));
// Session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
    },
  })
);
// Passport inicialización
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", sessionRouter);
app.use("/", filesRouter);
app.use("/", userRouter);


const server = http.createServer(app);

// Configuración del socket
setupSocketServer(server);

// Conectar con Mongo
mongoose.connect(process.env.MONGO_URL);

// Arrancar el servidor
server.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});

// Endpoint si el servidor falla
server.on("error", (err) => {
  console.error(err);
});

