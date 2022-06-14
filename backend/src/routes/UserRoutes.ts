import { Router } from "express";
import bodyParser from "body-parser";
import * as UserController from "../controllers/UserController";
import loginVerification from "../middlewares/LoginVerification";

const UserRouter = Router();
const jsonParser = bodyParser.json();

UserRouter.post("/login", jsonParser, UserController.login);
UserRouter.post("/users", jsonParser, UserController.registration);
UserRouter.get("/users/self", loginVerification, UserController.retrieve);

UserRouter.delete("/login", UserController.logout);
UserRouter.get("/logout", UserController.logout);

export default UserRouter;
