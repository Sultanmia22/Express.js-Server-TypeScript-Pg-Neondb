import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Role } from "../constants/role";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers?.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Unauthorize access!",
        });
      }

      // validation token
      const decode = jwt.verify(token, config.JWT_ACCESS_SECRET) as JwtPayload;

      const user = await pool.query(
        `
        SELECT * FROM users 
        WHERE email=$1
        `,
        [decode?.email],
      );

      if (!user.rows[0]) {
        return res.status(404).json({
          success: false,
          message: "User Not Found",
        });
      }

      if (roles.length > 0 && !roles.includes(user.rows[0].role as Role)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access!!"
        });
      }

      req.user = decode;

      next();
    } catch (er) {
      next(er);
    }
  };
};

export default auth;
