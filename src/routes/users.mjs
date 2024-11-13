import { Router } from "express";
import {
  check,
  checkSchema,
  matchedData,
  query,
  validationResult,
} from "express-validator";
import { getUserValidationSchema } from "../utils/getValidationSchema.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchema.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";

const router = Router();

// qurey parameters like /api/user?filter=username&value=will
router.get("/api/users", checkSchema(getUserValidationSchema), (req, res) => {
  // console.log(req);
  console.log(req.session);
  console.log(req.session.id);
  req.sessionStore.get(req.session.id, (err, sessionData) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(sessionData);
  });
  const result = validationResult(req);
  console.log(result);
  if (!result.isEmpty())
    return res.status(400).send({ errors: result.array() });
  const {
    query: { filter, value },
  } = req;
  // when filter and value were undefine
  // if (!filter &&!value) return res.send(mockUsers);
  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  return res.send(mockUsers);
});

router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.status(404).send("User not found");
  return res.send(findUser);
});

router.post(
  "/api/users", checkSchema(createUserValidationSchema), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.send(result.array());
    // const { body } = req;
    const data = matchedData(req);
    console.log(data)
    const newUser = new User(data);
    try {
      const saveUser = await newUser.save();
      return res.status(201).send(saveUser);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  }
);

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});

export default router;
