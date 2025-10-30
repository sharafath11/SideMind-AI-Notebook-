import { ISubject } from "../../types/subjectTypes";
import { ISubjectDto } from "./ISubjectDto";

export class SubjectResponseMapper {
    static addSubjectResponse(data: ISubject): ISubjectDto{
        return {
            subId: data._id.toString(),
            title: data.title,
            description: data.description || "",
            date:data.createdAt
        }
    }
}