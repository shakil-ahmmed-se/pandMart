import express from "express";

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "johndee", displayName: "John Doe" },
  { id: 2, username: "karim", displayName: "Karim Islam" },
  { id: 3, username: "william", displayName: "William Jonson" },
  { id: 4, username: "willson", displayName: "Wilsom Jonson" },
];

const app = express();
app.use(express.json());

// qurey parameters like /api/user?filter=username&value=will
app.get("/api/users", (req, res, next) => {
  // console.log(req.query)
  const {
    query: { filter, value },
  } = req;
  // when filter and value were undefine
  if (!filter && !value) return res.send(mockUsers);
  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  return res.send(mockUsers);
});

app.post("/api/users", (req, res, next) => {
  console.log(req.body);
  const { body } = req;
  if (!body.username && !body.displayName)
    return res.status(400).json({ msg: "username or displayName is required" });
  const newUser = {
    id: mockUsers[mockUsers.length - 1].id + 1,
    ...body,
  };
  mockUsers.push(newUser);
  return res.status(201).send(mockUsers);
});

app.get("/api/products", (req, res, next) => {
  res.send([
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
  ]);
});

app.get("/api/users/:id", (req, res, next) => {
  console.log(req.params);
  const parseId = parseInt(req.params.id);
  console.log(parseId);
  if (isNaN(parseId))
    return res.status(400).send({ msg: "Bad Request. Invalid Id" });
  const findUser = mockUsers.find((user) => user.id === parseId);
  if (!findUser) return res.status(404).send({ msg: "User not found" });
  return res.send(findUser);
});

app.put("/api/users/:id", (req, res, next) => {
  const {
    body,
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers[findUserIndex] = { id: parseId, ...body };
  return res.sendStatus(200);
});

app.patch('/api/users/:id', (req, res, next) => {
    const { body, params: {id}} = req;
    const parseId = parseInt(id);
    if(isNaN(parseId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex(user => user.id === parseId);
    if(findUserIndex === -1) return res.sendStatus(404);
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body};
    return res.sendStatus(200);
})

app.delete("/api/users/:id", (req, res, next)=>{
    const { params: {id}} = req;
    const parseId = parseInt(id);
    if(isNaN(parseId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex(user => user.id === parseId);
    if(findUserIndex === -1) return res.sendStatus(404);
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(204).send(mockUsers);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
