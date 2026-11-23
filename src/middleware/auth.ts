import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../config";
import { pool } from "../db";

const auth = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers?.authorization

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorize access!"
        })
    }

    // validation token 
    const decode = jwt.verify(token, config.jwt_secret) as JwtPayload 

    const user = await pool.query(`
        SELECT * FROM users 
        WHERE email=$1
        `, [decode?.email])
      
    
    if(!user.rows[0]) {
        return res.status(404).json({
            success: false,
            message: "User Not Found"
        })
    };    

    next()
}

export default auth