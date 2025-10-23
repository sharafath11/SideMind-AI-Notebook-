import { Request, Response } from "express";
import { ISubjectController } from "../core/interfaces/controllers/ISubject.Controller";
import { handleControllerError, sendResponse, throwError } from "../utils/response";
import { MESSAGES } from "../const/messages";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../core/types";
import { ISubjectService } from "../core/interfaces/services/ISubject.Service";
import { StatusCode } from "../enums/statusCode";
import { validateAddSubject } from "../validation/subject.validation";
@injectable()
export class SubjectController implements ISubjectController{
    constructor(@inject(TYPES.IAuthServices) private _subjectService :ISubjectService){}
  getSubject(req: Request, res: Response): Promise<void> {
      throw new Error("Method not implemented.");
  }
  editSubjet(req: Request, res: Response): Promise<void> {
      throw new Error("Method not implemented.");
  }
  deleteSubject(req: Request, res: Response): Promise<void> {
      throw new Error("Method not implemented.");
  }
 async addSubject(req: Request, res: Response): Promise<void> {
  try {
    const { title, description } = req.body; 
    validateAddSubject( title, description );
    const result = await this._subjectService.addSubject(title, description);
    sendResponse(
      res,
      StatusCode.CREATED,
      MESSAGES.SUBJECT.CREATE_SUCCESS,
      true,
      result
    );
  } catch (error) {
    handleControllerError(res, error);
  }
}

}