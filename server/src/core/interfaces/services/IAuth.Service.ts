import {IUserDto, IUserLoginDTO } from "../../../dtos/user/IUserDto";
import { ISignup } from "../../../types/authTypes";

export interface IAuthService {
    auth(googleId:string,username:string,email:string):Promise<IUserLoginDTO>,
    getUser(id:string):Promise<IUserDto>
}