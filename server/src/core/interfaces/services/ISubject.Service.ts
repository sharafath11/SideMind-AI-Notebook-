import { ISubjectDto } from "../../../dtos/subject/ISubjectDto";

export interface ISubjectService {
    getSubject (title:string,discription:string):Promise<void>,
    addSubject (title: string, description:string): Promise<ISubjectDto>,
    editSubjet(req:Request,res:Response):Promise<void>,
    deleteSubject(req:Request,res:Response):Promise<void>,
}