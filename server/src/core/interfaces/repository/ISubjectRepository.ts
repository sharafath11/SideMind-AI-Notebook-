import { ISubject } from "../../../types/subjectTypes";
import { IBaseRepository } from "./IBaseRepository";
export interface ISubjectRepository extends IBaseRepository<ISubject, ISubject> {
  findSubjectsWithQuery(options: {
    userId: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }): Promise<{ data: ISubject[]; total: number; totalPages: number }>;

}

