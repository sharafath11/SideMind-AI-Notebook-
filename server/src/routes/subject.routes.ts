import express from "express";
import { container } from "tsyringe";
import { TYPES } from "../core/types";
import { ISubjectController } from "../core/interfaces/controllers/ISubject.Controller";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();
const subjectController = container.resolve<ISubjectController>(TYPES.ISubjectController);
router
  .route("/")
  .get(authenticateToken, subjectController.getSubject.bind(subjectController))
  .post(authenticateToken, subjectController.addSubject.bind(subjectController));

router
  .route("/:id")
  .put(authenticateToken, subjectController.editSubjet.bind(subjectController))
  .delete(authenticateToken, subjectController.deleteSubject.bind(subjectController));

export default router;
