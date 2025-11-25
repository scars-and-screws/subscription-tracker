import { Router } from "express";
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

//  Route to get all users
userRouter.get("/", getUsers);

//  Route to get single user details
userRouter.get("/:id", authMiddleware, getUser);

//  Route to create a new user
userRouter.post("/", (req, res) => {
  res.send({ title: "Create new user" });
});

//  Route to update an existing user
userRouter.put("/:id", authMiddleware, updateUser);

//  Route to delete an existing user
userRouter.delete("/:id", authMiddleware, deleteUser);

export default userRouter;
