import express from "express";
import userRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs"

const PORT = process.env.PORT || 3012;

const app = express();
app.use(express.json());

// user router use
app.use(userRouter);
app.use(productsRouter);

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Hello Oworld" });
});

// qurey parameters like /api/user?filter=username&value=will



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
