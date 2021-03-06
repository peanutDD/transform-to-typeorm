import { Response, NextFunction, Request } from "express";

import StatusCodes from "http-status-codes";
import HttpException from "../exceptions/HttpException";

import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/Jwt";

import config from "../config/config";
import { User } from "../entity/User";

const { UNAUTHORIZED } = StatusCodes

const checkAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers["authorization"];

  if (authorizationHeader) {
    const token = authorizationHeader.split("Bearer ")[1];

    if (token) {
      try {
        const jwtData = jwt.verify(token, config.auth.secretKey) as JwtPayload;

        const user = await User.findOne(jwtData.id);

        if (user) {
          req.currentUser = user;
          return next();
        } else {
          return next(new HttpException(UNAUTHORIZED, "No such user"));
        }
      } catch (error) {
        return next(new HttpException(UNAUTHORIZED, "Invalid/Expired token"));
      }
    }

    return next(
      new HttpException(
        UNAUTHORIZED,
        "Authorization token must be 'Bearer [token]"
      )
    );
  }

  next(
    new HttpException(UNAUTHORIZED, "Authorization header must be provided")
  );
};

export default checkAuth;