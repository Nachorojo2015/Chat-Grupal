import { Router } from "express";
import multer from "multer";
import fs from "node:fs";

const filesRouter = Router();
const upload = multer({ dest: "uploads/" });

// Fila / Documento
filesRouter.post("/files/:name", upload.single("document"), (req, res) => {
  const { name } = req.params;
  saveFile(req.file, name)
    .then(() => {
      res.send({ status: "OK" });
    })
    .catch((error) => {
      console.error("Error saving file:", error);
      res.status(500).send({ error: "Error saving file" });
    });
});

function saveFile(file, name) {
  return new Promise((resolve, reject) => {
    const newPath = `./uploads/documents/${name}`;
    fs.rename(file.path, newPath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Imágenes / Videos. Media
filesRouter.post("/images-videos/:name", upload.single("media"), (req, res) => {
  const { name } = req.params;
  saveMedia(req.file, name)
    .then(() => {
      res.send({ status: "OK" });
    })
    .catch((error) => {
      console.error("Error saving media:", error);
      res.status(500).send({ error: "Error saving media" });
    });
});

function saveMedia(media, name) {
  return new Promise((resolve, reject) => {
    const newPath = `./uploads/media/${name}`;
    fs.rename(media.path, newPath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Audios
filesRouter.post("/audio/:name", upload.single("audio"), (req, res) => {
  const { name } = req.params;
  if (!req.file) {
    return res.status(400).send({ error: "No audio file uploaded" });
  }
  saveAudio(req.file, name)
    .then(() => {
      res.send({ status: "OK" });
    })
    .catch((error) => {
      console.error("Error saving audio:", error);
      res.status(500).send({ error: "Error saving audio" });
    });
});

function saveAudio(audio, name) {
  return new Promise((resolve, reject) => {
    const newPath = `./uploads/audio/${name}`;
    fs.rename(audio.path, newPath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Subir Imágen del grupo
filesRouter.post("/group/photo/:name", upload.single("photoGroup"), (req, res) => {
  const { name } = req.params;
  if (!req.file) {
    return res.status(400).send({ error: "No image uploaded" });
  }
  savePhotoGroup(req.file, name)
    .then(() => {
      res.send({ status: "OK" });
    })
    .catch((error) => {
      console.error("Error saving photo:", error);
      res.status(500).send({ error: "Error saving photo" });
    });
});

function savePhotoGroup(file, name) {
  return new Promise((resolve, reject) => {
    const newPath = `./uploads/groupPictures/${name}`;
    fs.rename(file.path, newPath, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export { filesRouter };
