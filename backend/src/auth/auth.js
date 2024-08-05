import dotnev from "dotenv";
import passport from "passport";
import localStrategy from "passport-local";
import passportJwt from "passport-jwt";
import GitHubStrategy from "passport-github2";
import bcryptjs from "bcryptjs";
import DiscordStrategy from "passport-discord";

// Model User
import { usersModel } from "../database/models/users.js";

// Config Dotenv
dotnev.config();

// Jwt Strategy
const JWTStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;

// Passport Local Strategy
const LocalStrategy = localStrategy.Strategy;

// Serialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserealize User
passport.deserializeUser(async (id, done) => {
  const user = await usersModel.findById(id);
  done(null, user);
});

// Local Strategy
// REGISTRO
passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
      usernameField: "email",
      passwordField: "password",
    },
    async (req, email, password, done) => {
      try {
        const { username } = req.body;
        if (!username) {
          return done(null, false, { message: "The name is not defined" });
        }

        const user = await usersModel.findOne({ email });

        if (user) {
          return done(null, false, { message: "This user already exists" });
        } else {
          const userMongoDB = await usersModel.create({
            username,
            email,
            password: await bcryptjs.hash(password, 10),
          });
          return done(null, userMongoDB);
        }
      } catch (err) {
        done(err);
      }
    }
  )
);

// LOGIN
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await usersModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: "The user dont exist" });
        }

        const validatePassword = await bcryptjs.compare(
          password,
          user.password
        );

        if (!validatePassword) {
          return done(null, false, {
            message: "The user passsword is incorrect",
          });
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// Github Strategy for OAuth authentication, LOGIN
passport.use(
  "auth-github",
  new GitHubStrategy.Strategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// Discord Strategy
passport.use(
  "discord",
  new DiscordStrategy.Strategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: "/auth/redirect",
      scope: ["identify"],
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// JWT Strategy
passport.use(
  "jwt",
  new JWTStrategy(
    {
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        done(null, token);
      } catch (err) {
        console.log(err);
        done(err);
      }
    }
  )
);
