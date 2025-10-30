import { ISubjectDto } from "../../../dtos/subject/ISubjectDto";

export interface ISubjectService {
    getSubjects(
    userId:string,
    search?: string,
    sortBy?: "name" | "date" | "chapters",
    page?: number,
    limit?: number
  ): Promise<ISubjectDto[]>;

  addSubject(userId:string,title: string, description: string): Promise<ISubjectDto>;

  editSubject(
    id: string,
    title?: string,
    description?: string
  ): Promise<ISubjectDto>;

  deleteSubject(id: string): Promise<void>;
}