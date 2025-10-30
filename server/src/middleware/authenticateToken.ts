import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/response";
import { StatusCode } from "../enums/statusCode";
import { MESSAGES } from "../const/messages";
import {
  clearTokens,
  refreshAccessToken,
  setTokensInCookies,
  verifyAccessToken,
} from "../utils/jwtToken";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { TokenPayload } from "../types/authTypes";

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.token;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken) {
    return sendResponse(res, StatusCode.UNAUTHORIZED, MESSAGES.AUTH.AUTH_REQUIRED, false);
  }

  try {
    const decoded = verifyAccessToken(accessToken) as TokenPayload;
    if (decoded?.id && decoded.role === "user") {
      req.user = decoded;
      return next();
    }

    clearTokens(res);
    return sendResponse(res, StatusCode.FORBIDDEN, MESSAGES.COMMON.ACCESS_DENIED, false);

  } catch (error) {
    if (error instanceof TokenExpiredError) {
      if (!refreshToken) {
        clearTokens(res);
        return sendResponse(res, StatusCode.UNAUTHORIZED, MESSAGES.AUTH.INVALID_TOKEN, false);
      }

      try {
        const newTokens = await refreshAccessToken(refreshToken);
        if (!newTokens) {
          clearTokens(res);
          return sendResponse(res, StatusCode.UNAUTHORIZED, MESSAGES.AUTH.INVALID_TOKEN, false);
        }
        setTokensInCookies(res, newTokens.accessToken, newTokens.refreshToken);

        const decoded = verifyAccessToken(newTokens.accessToken) as TokenPayload;
        if (decoded?.id && decoded.role === "user") {
          req.user = decoded;
          return next();
        }

        clearTokens(res);
        return sendResponse(res, StatusCode.FORBIDDEN, MESSAGES.COMMON.ACCESS_DENIED, false);
      } catch {
        clearTokens(res);
        return sendResponse(res, StatusCode.UNAUTHORIZED, MESSAGES.AUTH.INVALID_TOKEN, false);
      }
    }

    if (error instanceof JsonWebTokenError) {
      clearTokens(res);
      return sendResponse(res, StatusCode.UNAUTHORIZED, MESSAGES.AUTH.INVALID_TOKEN, false);
    }
    return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, MESSAGES.COMMON.SERVER_ERROR, false);
  }
};
