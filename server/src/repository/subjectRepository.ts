import { ISubjectRepository } from "../core/interfaces/repository/ISubjectRepository";
import { SubjectModel } from "../models/subjectModel";
import { ISubject } from "../types/subjectTypes";
import { BaseRepository } from "./baseRepository";

export class SubjectRepository extends BaseRepository<ISubject,ISubject> implements ISubjectRepository {
    constructor() {
        super(SubjectModel)
    }
     async findSubjectsWithQuery({
    userId,
    search,
    sortBy,
    sortOrder,
    page,
    limit,
  }: {
    userId: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
    }) {
    return this.findWithQuery({
      filters: { userId },
      searchFields: ["title", "description"],
      search,
      sortBy,
      sortOrder,
      page,
      limit,
    });
  }
}