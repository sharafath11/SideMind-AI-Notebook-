import express from "express";
import { container } from "tsyringe";
import { TYPES } from "../core/types";
import { IAuthController } from "../core/interfaces/controllers/IAuth.Controller";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();
const authController = container.resolve<IAuthController>(TYPES.IAuthController);
router.post("/", authController.auth.bind(authController));
router.get("/user",authenticateToken,authController.getUser.bind(authController))
router.get("/refresh-token", authController.refeshToken.bind(authController))
router.post("/logout",authController.logout.bind(authController))
export default router;
