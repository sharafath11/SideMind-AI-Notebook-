import { inject, injectable } from "tsyringe";
import { ISubjectService } from "../core/interfaces/services/ISubject.Service";
import { TYPES } from "../core/types";
import { ISubjectRepository } from "../core/interfaces/repository/ISubjectRepository";
import { SubjectResponseMapper } from "../dtos/subject/SubjectResponseMapper";
import { ISubjectDto } from "../dtos/subject/ISubjectDto";
import { MESSAGES } from "../const/messages";

@injectable()
export class SubjectService implements ISubjectService {
  constructor(
    @inject(TYPES.ISubjectRepository)
    private _subjectRepo: ISubjectRepository
  ) {}

  async getSubjects(
    userId:string,
    search?: string,
    sortBy: "name" | "date" | "chapters" = "name",
    page = 1,
    limit = 10
  ): Promise<any> {
    const sortField =
      sortBy === "name" ? "title" : sortBy === "date" ? "createdAt" : "chapters";
    console.log("orapaaaa",userId)
    const { data, total, totalPages } = await this._subjectRepo.findSubjectsWithQuery({
      userId,
      search,
      sortBy: sortField,
      sortOrder: sortBy === "name" ? "asc" : "desc",
      page,
      limit,
    });

    return {
      subjects: data.map(SubjectResponseMapper.addSubjectResponse),
      total,
      page,
      totalPages,
    };
  }

  async addSubject(userId:string,title: string, description: string): Promise<ISubjectDto> {
    const result = await this._subjectRepo.create({ userId,title, description });
    return SubjectResponseMapper.addSubjectResponse(result);
  }

  async editSubject(
    id: string,
    title?: string,
    description?: string
  ): Promise<ISubjectDto> {
    const updated = await this._subjectRepo.update(id, { title, description });
    if (!updated) throw new Error(MESSAGES.SUBJECT.NOT_FOUND);
    return SubjectResponseMapper.addSubjectResponse(updated);
  }

  async deleteSubject(id: string): Promise<void> {
    const deleted = await this._subjectRepo.delete(id);
    if (!deleted) throw new Error(MESSAGES.SUBJECT.NOT_FOUND);
  }
}
