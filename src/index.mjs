import express from "express";
import { query, validationResult, body } from "express-validator";

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "johndee", displayName: "John Doe" },
  { id: 2, username: "karim", displayName: "Karim Islam" },
  { id: 3, username: "william", displayName: "William Jonson" },
  { id: 4, username: "willson", displayName: "Wilsom Jonson" },
];

const app = express();
app.use(express.json());

const logginMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

const resolveIndexByUserId = (req, res, next) => {
  const {
    body,
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex;
  next();
};

app.get(
  "/",
  (req, res, next) => {
    console.log("Base URL");
    next();
  },
  (req, res) => {
    res.status(200).send({ msg: "Hello Oworld" });
  }
);

// qurey parameters like /api/user?filter=username&value=will
app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must be not empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be 3-10 characters"),
  (req, res, next) => {
    // console.log(req);
    const result = validationResult(req);
    console.log(result);
    const {
      query: { filter, value },
    } = req;
    // when filter and value were undefine
    if (!filter && !value) return res.send(mockUsers);
    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    return res.send(mockUsers);
  }
);

app.post(
  "/api/users",
  [body("username")
    .isString()
    .notEmpty()
    .withMessage("username not empty")
    .isLength({ min: 5, max: 32 })
    .withMessage("Username must be 5-32 characters"),
    body("displayName").notEmpty(),
  ],
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty)
      return res.status(400).send({errors : result.array()})
    const { body } = req;
    if (!body.username && !body.displayName)
      return res
        .status(400)
        .json({ msg: "username or displayName is required" });
    const newUser = {
      id: mockUsers[mockUsers.length - 1].id + 1,
      ...body,
    };
    mockUsers.push(newUser);
    return res.status(201).send(mockUsers);
  }
);

app.get("/api/products", (req, res) => {
  res.send([
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
  ]);
});

app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.status(404).send({ msg: "User not found" });
  return res.send(findUser);
});

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
