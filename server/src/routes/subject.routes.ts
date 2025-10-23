import express from "express"
import { container } from "tsyringe";
import { ISubjectController } from "../core/interfaces/controllers/ISubject.Controller";
import { TYPES } from "../core/types";
import { authenticateToken } from "../middleware/authenticateToken";
const router = express.Router();
const subjectController = container.resolve<ISubjectController>(TYPES.ISubjectController);
router.post("/", authenticateToken, subjectController.addSubject.bind(subjectController))
export default router