import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";

passport.serializeUser((user, done)=>{
    console.log(`Inside serialize User`);
    console.log(user);
    done(null, user.id);
})

passport.deserializeUser(async(id, done)=>{
    console.log(`Inside deserialize User`);
    console.log(`Deserializing user Id: ${id}`);
   try {
    const findUser = await User.findById(id);
    if(!findUser) throw new Error("User Not Found");
    done(null, findUser)
   } catch (error) {
    done(error, null)
   }
})

export default passport.use( new Strategy(async(username, password, done)=>{
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    try {
        const findUser = await User.findOne({username});
        if(!findUser) throw new Error("User Not Found");
        if(findUser.password === password) throw new Error("Invalid password");
        done(null, findUser)

        // const findUser = mockUsers.find(user => user.username === username);
        // if(!findUser) throw new Error("User not found");
        // if(findUser.password !==password)
        //     throw new Error("Invalid password");
        // done(null, findUser);
    } catch (error) {
        done(error, null);
    }
}))