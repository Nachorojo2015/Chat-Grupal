import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";

import "../auth/auth.js";
import { usersModel } from "../database/models/users.js";

dotenv.config();

const sessionRouter = Router();

sessionRouter.post(
  "/signup",
  passport.authenticate("signup", {
    failureRedirect: "/failSignup",
  }),
  async (req, res) => {
    try {
      res.status(200).json({
        status: true,
        message: "User has been created!",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: false,
        message: "User creation failed!" + err,
      });
    }
  }
);

sessionRouter.get("/failSignup", (req, res) => {
  res.status(400).json({
    status: false,
    message: "Username or email is already in use.",
  });
});

sessionRouter.post("/login", (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(400).json({
          status: false,
          info,
        });
      }

      req.login(user, { session: false }, async (err) => {
        if (err) {
          return res.status(400).json({
            status: false,
            err,
          });
        }

        const token = jwt.sign(
          {
            id: user.id,
          },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );

        req.session.user = user._id;
        req.session.save();

        console.log(req.session.user);

        res.status(200).json({
          status: true,
          token,
          message: "Login has been successful.",
        });
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        status: false,
        message: `Error in login, ${err}`,
      });
    }
  })(req, res, next);
});

sessionRouter.get(
  "/github",
  passport.authenticate("auth-github", {
    scope: ["user:email"],
    session: false,
  })
);

sessionRouter.get(
  "/github/callback",
  passport.authenticate("auth-github", {
    scope: ["user:email"],
    session: false,
  }),
  async (req, res) => {
    const user = await usersModel.findOne({ email: req.user.emails[0].value });
    if (!user) {
      // create a new user with the github data and save it to the database
      const newUser = await usersModel.create({
        username: req.user.username,
        email: req.user.emails[0].value,
        password: await bcryptjs.hash(req.user.nodeId, 10),
        thumbnail: req.user.photos[0].value,
      });

      const token = jwt.sign(
        {
          id: newUser.id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).send(`<!DOCTYPE html>
      <html lang="en">
      <body>
      </body>
      <script>
        window.opener.postMessage('${JSON.stringify({
          token,
        })}', 'http://localhost:3000');
      </script>
      </html>`);
    } else {
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).send(`<!DOCTYPE html>
    <html lang="en">
    <body>
    </body>
    <script>
      window.opener.postMessage('${JSON.stringify({
        token,
      })}', 'http://localhost:3000');
    </script>
    </html>`);
    }
  }
);

sessionRouter.get("/discord", passport.authenticate("discord"));

sessionRouter.get(
  "/redirect",
  passport.authenticate("discord", {
    failureRedirect: "/failDiscord",
  }),
  async (req, res) => {
    const user = await usersModel.findOne({ username: req.user.username });

    if (!user) {
      const newUser = await usersModel.create({
        username: req.user.username,
        email: "No existe",
        password: await bcryptjs.hash(req.user.id, 10),
        thumbnail: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
      });

      const token = jwt.sign(
        {
          id: newUser.id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).send(`<!DOCTYPE html>
    <html lang="en">
    <body>
    </body>
    <script>
      window.opener.postMessage('${JSON.stringify({
        token,
      })}', 'http://localhost:3000');
    </script>
    </html>`);
    } else {
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).send(`<!DOCTYPE html>
    <html lang="en">
    <body>
    </body>
    <script>
      window.opener.postMessage('${JSON.stringify({
        token,
      })}', 'http://localhost:3000');
    </script>
    </html>`);
    }
  }
);

sessionRouter.get("/failDiscord", (req, res) => {
  res.send("Fail Login with discord");
});

sessionRouter.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      res.status(200).json({
        status: true,
        message: "User Authorized",
        user: await usersModel.findById(req.user.id),
      });
    } catch (err) {
      console.log(err);
      res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }
  }
);

//Logout
sessionRouter.get("/logout", passport.authenticate("jwt"), (req, res) => {
  req.session.destroy(async (err) => {
    if (err) {
      res.status(400).json({
        status: false,
        message: "Error in logout"
      })
    } else {
      const user = await usersModel.findById(req.user.id)
      user.time = new Date();
      await user.save()
      res.status(200).json({
        status: true,
        message: "Logout success!"
      })
    }
  })
})

export { sessionRouter };
