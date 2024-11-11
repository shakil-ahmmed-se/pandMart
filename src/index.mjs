import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3012;

const app = express();
app.use(express.json());
// cookieParser
app.use(cookieParser());
// user router use
app.use(routes);

app.get("/", (req, res) => {
  res.cookie("Hellow", "World", { maxAge:6000 * 60 * 2});
  res.status(200).send({ msg: "Hello Oworld" });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
