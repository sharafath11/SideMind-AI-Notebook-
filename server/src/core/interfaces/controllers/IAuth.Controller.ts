import { Request, Response } from "express";

export interface IAuthController {
    auth(req: Request, res: Response): Promise<void>
    getUser(req: Request, res: Response): Promise<void>
    refeshToken(req: Request, res: Response): Promise<void>
    logout(req:Request,res:Response):Promise<void>
}