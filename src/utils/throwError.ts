import { ValidationError } from "class-validator";
import HttpException from "../exceptions/HttpException";
import StatusCodes from "http-status-codes";

export const throwInputError = (errors: ValidationError[], message: string) => {
  throw new HttpException(StatusCodes.UNPROCESSABLE_ENTITY, message, errors);
};

export const throwActionNotAllowedError = () => {
  throw new HttpException(StatusCodes.UNAUTHORIZED, "Action not allowed");
};