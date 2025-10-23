import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAuthController } from "../core/interfaces/controllers/IAuth.Controller";
import { IAuthService } from "../core/interfaces/services/IAuth.Service";
import { TYPES } from "../core/types";
import { MESSAGES } from "../const/messages";
import { StatusCode } from "../enums/statusCode";
import {
  handleControllerError,
  sendResponse,
  throwError,
} from "../utils/response";
import { validateBodyFields } from "../utils/validateRequest";
import { clearTokens, decodeToken, refreshAccessToken, setTokensInCookies } from "../utils/jwtToken";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.IAuthServices) private  _authServices: IAuthService
  ) {}

  async auth(req: Request, res: Response): Promise<void> {
    try {
      validateBodyFields(req, ["email", "username","googleId"])
      const { googleId,username, email } = req.body;
      if (!googleId || !username ||!email) throwError(MESSAGES.COMMON.MISSING_FIELDS,StatusCode.BAD_REQUEST);

      const result = await this._authServices.auth(googleId,username,email);
      setTokensInCookies(res, result.tocken, result.refreshToken);
      sendResponse(
        res,
        StatusCode.OK,
        MESSAGES.AUTH.LOGIN_SUCCESS,
        true,
        result
      );
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies.token;
      const decode = decodeToken(token);
      if(!decode)throwError(MESSAGES.AUTH.AUTH_REQUIRED)
      const result = await this._authServices.getUser(decode?.id);
      sendResponse(res,StatusCode.OK,MESSAGES.COMMON.SUCCESS,true,result)
    } catch (error) {
      handleControllerError(res,error)
    }
  }
  async refeshToken(req: Request, res: Response): Promise<void> {
    try {
      const tokens = refreshAccessToken(req.cookies.refreshToken);
      if (!tokens) throwError(MESSAGES.AUTH.INVALID_TOKEN,StatusCode.UNAUTHORIZED);
      setTokensInCookies(res, tokens.accessToken, tokens.refreshToken);
      sendResponse(res, StatusCode.OK, "", true);
      return;
    } catch (error) {
      handleControllerError(res, error, StatusCode.UNAUTHORIZED);
      
    }
  }
  async logout(req: Request, res: Response): Promise<void> {
    try {
      clearTokens(res);
      sendResponse(res,StatusCode.OK,MESSAGES.AUTH.LOGOUT_SUCCESS,true)
    } catch (error) {
      handleControllerError(res,error)
    }
  }
}
