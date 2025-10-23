import { Request, Response } from "express";

export interface ISubjectController {
    getSubject (req: Request, res: Response) : Promise<void>,
    addSubject (req: Request, res: Response): Promise<void>,
    editSubjet(req:Request,res:Response):Promise<void>,
    deleteSubject(req:Request,res:Response):Promise<void>,
}