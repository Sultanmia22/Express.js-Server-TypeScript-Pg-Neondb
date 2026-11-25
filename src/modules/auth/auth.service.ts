import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { ILoginData } from "./auth.interface";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { AppError } from "../../errors/AppError";

const loginUserIntoDB = async (payload: ILoginData) => {
  // step 1: check if user exists in db
  const { email, password } = payload;
  const user = await pool.query(
    `
            SELECT * FROM users
            WHERE email = $1
        `,
    [email],
  );

  if (user.rowCount === 0) {
    throw new AppError("User Not Found!",404)
  }

  // step2: checked if password are matched ?
  const matchPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassword) {
    throw new AppError("Invalid Credentials",401);
  }

  // step3 : check the user status
  if (!user.rows[0].is_active) {
    throw new AppError("Fobidden",403)
  }

  // step4: Generate jwt token
  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  // Access Token
  const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });

  // RrfreshToken
  const refreshToken = jwt.sign(jwtPayload, config.JWT_REFRESH_SECRET, {
    expiresIn: "10d",
  });

  delete user.rows[0].password;

  return { accessToken, refreshToken, user: user.rows[0] };
};

const generateAccessToken = async (token: string) => {
  if (!token) {
    throw new AppError("Unauthorized access!",401)
  }

  const decode = jwt.verify(token, config.JWT_REFRESH_SECRET) as JwtPayload;

  const user = await pool.query(
    `
        SELECT * FROM users 
        WHERE email=$1
        `,
    [decode.email],
  );

  if(user.rowCount === 0){
    throw new AppError("User Not Found!",404)
  }


  // step3 : check the user status
  if (!user.rows[0].is_active) {
    throw new AppError("Fobidden",403)
  }

  // step4: Generate jwt token
  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  // Access Token
  const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });

  return {accessToken}

};

export const authService = {
  loginUserIntoDB,
  generateAccessToken,
};
