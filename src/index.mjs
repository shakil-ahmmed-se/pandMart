import express, { response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
// import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";



const PORT = process.env.PORT || 3012;

const app = express();

mongoose.connect("mongodb://localhost:27017/pandaMart")
  .then(() => console.log('Connected to mongodb'))
  .catch((err) => console.log(err))
app.use(express.json());
// cookieParser
app.use(cookieParser("helloworld"));

// session middleware  and also must be registered before the all api endpoints or routes
app.use(
  session({
    secret: "helloworld",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60, // default 1 hour
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    })
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());
// user router use
app.use(routes);

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  // console.log(req.sessionID)  this is same as session.id
  req.session.visited = true;
  res.cookie("hello", "world", { maxAge: 300000, signed: true });
  res.status(200).send({ msg: "Hello Oworld" });
});

app.post('/api/auth', passport.authenticate("local"), (req, res)=>{
  res.sendStatus(200);
})

app.get('/api/auth/status', (req, res) => {
  console.log(`Inside /api/auth/status endpoint`);
  console.log(req.user);
  return req.user ? res.send(req.user) : res.sendStatus(401);
})


app.post('/api/auth/logout', (req, res) => {
  if(!req.user) return res.sendStatus(401);
  req.logout((err)=>{
    if(err) return res.sendStatus(400);
    res.send(200);
  })
})
// discord authentication
app.get('/api/auth/discord',passport.authenticate("discord"), (req, res) => {

})

app.get('/api/auth/discord/redirect', passport.authenticate("discord"), (req, res)=>{
  console.log('Inside /api/auth/discord/redirect endpoint');
  console.log(req.session);
  console.log(req.user);
  res.sendStatus(200);
})









app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
