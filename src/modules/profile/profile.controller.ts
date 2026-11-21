import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async (req: Request, res: Response) => {
  try {

    const result = await profileService.createProfileIntoDB(req.body);

    res.status(201).json({
        success: true,
        message: "Profile Created Successfully",
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

export const profileController = {
  createProfile,
};
