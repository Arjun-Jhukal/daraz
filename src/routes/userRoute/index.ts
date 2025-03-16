import express, { Request, Response } from "express";
import { changeUserRole, getAllUsers, getUserByEmailOrId } from "../../controllers/userController";

const userRoutes = express.Router();


userRoutes.put("/changeRole", (req: Request, res: Response) => { changeUserRole(req, res) });
userRoutes.get("/getAllUsers", (req: Request, res: Response) => { getAllUsers(req, res) });
userRoutes.get("/getUser", (req: Request, res: Response) => { getUserByEmailOrId(req, res) });

export default userRoutes;