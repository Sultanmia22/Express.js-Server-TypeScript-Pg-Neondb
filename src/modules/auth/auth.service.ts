import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { ILoginData } from "./auth.interface";
import jwt from "jsonwebtoken"

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
        throw new Error("Invalid Credentials")
    };

    // step2: checked if password are matched ?
    const matchPassword = await bcrypt.compare(password, user.rows[0].password)

    if (!matchPassword) {
        throw new Error("Invalid Credentials")
    };

    console.log(user)

    // step3 : check the user status
    if (!user.rows[0].is_active) {
        throw new Error("Access Denied!")
    };

    // step4: Generate jwt token
    const jwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
    };

    const secret = process.env.JWT_SECRET as string;

    const accessToken = jwt.sign(jwtPayload, secret,{expiresIn: "1d"})

    delete user.rows[0].password

    return {accessToken,user:user.rows[0]};
};

export const authService = {
    loginUserIntoDB,
};
