import express, { response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";

const PORT = process.env.PORT || 3012;

const app = express();
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
  })
);
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

app.post("/api/auth", (req, res) => {
  const { username, password } = req.body;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return res.status(401).send({ msg: "Bad Credentials" });

  req.session.user = findUser;
  res.status(200).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Internal Server Error" });
    }
    console.log(session);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "Not Authenticated" });
});

app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  const { body:{ item  }} = req;
  const { cart } = req.session;
  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);
});

app.get("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  return res.send(req.session.cart ?? []);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
