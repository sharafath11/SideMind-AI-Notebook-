import { inject } from "tsyringe";
import { ISubjectService } from "../core/interfaces/services/ISubject.Service";
import { TYPES } from "../core/types";
import { ISubjectRepository } from "../core/interfaces/repository/ISubjectRepository";
import { SubjectResponseMapper } from "../dtos/subject/SubjectResponseMapper";
import { ISubjectDto } from "../dtos/subject/ISubjectDto";
import { MESSAGES } from "../const/messages";

export class SubjectService implements ISubjectService {
  constructor(
    @inject(TYPES.ISubjectRepository) private _subjectRepo: ISubjectRepository
  ) {}
  getSubject(title: string, discription: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  editSubjet(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteSubject(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async addSubject(title: string, description: string): Promise<ISubjectDto> {
    const existingSubjects = await this._subjectRepo.findAll({
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });

    if (existingSubjects.length > 0)
      throw new Error(MESSAGES.SUBJECT.ALREADY_EXISTS);

    const result = await this._subjectRepo.create({ title, description });
    return SubjectResponseMapper.addSubjectResponse(result);
  }
}
