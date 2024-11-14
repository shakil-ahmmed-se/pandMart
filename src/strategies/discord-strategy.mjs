import passport from "passport";
import { User } from "../mongoose/schemas/user.mjs";
import Strategy from "passport-discord";
import dotenv from "dotenv";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";
dotenv.config();

passport.serializeUser((user, done) => {
  console.log(`Inside the serializeUser: `);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`Inside the deserializeUser: `);
  console.log(`Deserializers user Id: ${id}`);
  try {
    const findUser = await DiscordUser.findById(id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: process.env.client_id,
      clientSecret: process.env.secret_key,
      callbackURL: process.env.redirect_uri,
      scope: ["identify", "guilds", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      let findUser;
      try {
        findUser = await DiscordUser.findOne({ discordId: profile.id });
      } catch (error) {
        return done(error, null);
      }
      try {
        if (!findUser) {
          const newUser = new DiscordUser({
            username: profile.username,
            discordId: profile.id,
          });
          const saveUser = await newUser.save();
          return done(null, saveUser);
        }
        return done(null, findUser);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);
