import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    try{
        const result = await authService.loginUserIntoDB(req.body);

        const {refreshToken} = result

        // set refreshToken in cookies 
        res.cookie("refreshToken", refreshToken, {
            secure: false, // when code are run production the secure proparty are true
            httpOnly: true, 
            sameSite: "lax", // "none", "strict", "lax"
            path: "/",
            domain: "localhost",
        })

        res.status(200).json({
            success: true,
            message: "Login Successfully!",
            data: result
        })
    } catch (er) {
        if (er instanceof Error) {
            console.log("Error Message:", er);
            return res.status(500).json({
                success: false,
                message: er?.message,
                error: er,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Enternal Server Error",
            error: er,
        });
    }
};

const generateToken = async (req: Request, res: Response) => {
    try{
        const result = await authService.generateAccessToken(req.cookies.refreshToken)


        res.status(200).json({
            success: true,
            message: "access token generated successfully!",
            data: result
        })
    } catch (er) {
        if (er instanceof Error) {
            console.log("Error Message:", er);
            return res.status(500).json({
                success: false,
                message: er?.message,
                error: er,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Enternal Server Error",
            error: er,
        });
    }
}


export const authController = {
    loginUser,
    generateToken
}