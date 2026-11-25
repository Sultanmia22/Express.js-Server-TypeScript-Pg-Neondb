import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    try{
        const result = await authService.loginUserIntoDB(req.body);

        // console.log(result)

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
}

export const authController = {
    loginUser
}