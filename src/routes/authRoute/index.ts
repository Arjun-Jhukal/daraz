import express, { Request, Response } from "express";
import { getOTP, loginUser, logoutUser, registerUser, verifyEmail, verifyResetCodeAndChangePassword } from "../../controllers/authController";


const authRoutes = express.Router();


authRoutes.post("/register", (req: Request, res: Response) => { registerUser(req, res) })
authRoutes.post("/login", (req: Request, res: Response) => { loginUser(req, res) })
authRoutes.post("/forgot-password", (req: Request, res: Response) => { verifyEmail(req, res) })
authRoutes.get("/get-otp", (req: Request, res: Response) => { getOTP(req, res) })
authRoutes.post("/reset-password", (req: Request, res: Response) => { verifyResetCodeAndChangePassword(req, res) })
authRoutes.post("/logout", (req: Request, res: Response) => { logoutUser(req, res) })


export default authRoutes;