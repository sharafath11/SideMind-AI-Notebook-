import { Request, Response } from "express";
import { ISubjectController } from "../core/interfaces/controllers/ISubject.Controller";
import { handleControllerError,sendResponse,} from "../utils/response";
import { MESSAGES } from "../const/messages";
import { inject, injectable } from "tsyringe";
import { TYPES } from "../core/types";
import { ISubjectService } from "../core/interfaces/services/ISubject.Service";
import { StatusCode } from "../enums/statusCode";
import { validateAddSubject } from "../validation/subject.validation";
import { decodeToken } from "../utils/jwtToken";

@injectable()
export class SubjectController implements ISubjectController {
  constructor(
    @inject(TYPES.ISubjectService)
    private _subjectService: ISubjectService
  ) {}

  async getSubject(req: Request, res: Response): Promise<void> {
    try {      
      const decoded=decodeToken(req.cookies.token)
      const { search, sortBy, page, limit } = req.query;
      const result = await this._subjectService.getSubjects(
        decoded?.id as string,
        search as string,
        (sortBy as "name" | "date" | "chapters") || "name",
        parseInt(page as string) || 1,
        parseInt(limit as string) || 10
      );

      sendResponse(
        res,
        StatusCode.OK,
        MESSAGES.SUBJECT.SUCCESS,
        true,
        result
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async addSubject(req: Request, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;
      validateAddSubject(title, description);
      const decoded = decodeToken(req.cookies.token);
      const result = await this._subjectService.addSubject(decoded?.id||"",title, description);

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

  async editSubjet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const result = await this._subjectService.editSubject(
        id,
        title,
        description
      );

      sendResponse(
        res,
        StatusCode.OK,
        MESSAGES.SUBJECT.UPDATE_SUCCESS,
        true,
        result
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async deleteSubject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this._subjectService.deleteSubject(id);

      sendResponse(
        res,
        StatusCode.OK,
        MESSAGES.SUBJECT.DELETE_SUCCESS,
        true,
        null
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
