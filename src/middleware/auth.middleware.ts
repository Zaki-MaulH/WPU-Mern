import { NextFunction, Request, Response } from "express";
import { IUserToken } from "../utils/jwt";
import { getUserData } from "../utils/jwt";

export interface IRequest extends Request {
  user?: IUserToken;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(403).json({ 
        message: "Unauthorized",
        data: null, 
    });
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    return res.status(403).json({
        message: "Unauthorized",
        data: null,
    });
  }

  const user = getUserData(token);

  if (!user) {
    return res.status(403).json({
        message: "Unauthorized",
        data: null,
    });
  }

  (req as IRequest).user = user;
  
  next();
}
