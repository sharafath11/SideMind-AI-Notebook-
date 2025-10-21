import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { IAuthService } from "../core/interfaces/services/IAuthService";
import { IAuthRepository } from "../core/interfaces/repository/IAuthRepository";
import { TYPES } from "../core/types";
import { throwError } from "../utils/response";
import { MESSAGES } from "../const/messages";
import { UserResponseMapper } from "../dtos/user/userResponseMapper";
import { IUserDto, IUserLoginDTO } from "../dtos/user/IUserDto";
import { UserForwardMapper } from "../dtos/user/userForwardMapper";
import { ISignup } from "../types/authTypes";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtToken";
 

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IAuthRepository)
    private  _authRepo: IAuthRepository
  ) {}

  async auth(googleId: string, username: string, email: string): Promise<IUserLoginDTO> {
    const existingUser = await this._authRepo.findOne({ googleId });
    if (existingUser) {
    const token = generateAccessToken(existingUser._id as unknown as string,"user");
    const refreshToken = generateRefreshToken(existingUser._id as unknown as string,"user");
      return UserResponseMapper.toLoginUserResponse(existingUser,token,refreshToken)
    }
    const user = await this._authRepo.create({ googleId, username, email });
     const token = generateAccessToken(user._id as unknown as string,"user");
    const refreshToken = generateRefreshToken(user._id as unknown as string,"user");
    return UserResponseMapper.toLoginUserResponse(user,token,refreshToken)
   
  }
  async getUser(id: string): Promise<IUserDto> {
    const user = await this._authRepo.findById(id);
    if (!user) throwError(MESSAGES.COMMON.SERVER_ERROR);
    return  UserResponseMapper.toUserResponse(user)
  }
}
