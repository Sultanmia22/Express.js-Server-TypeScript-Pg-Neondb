import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);

    // console.log("Result: ", result);

    res.status(201).json({
      success: true,
      message: "User Create Successfully!!",
      data: result,
    });
  } catch (er) {
    if (er instanceof Error) {
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

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUserFromDB();

    console.log("result users data: ", result);

    res.status(200).json({
      success: true,
      message: "User Data Retrive Successfully!!",
      data: result,
    });
  } catch (er) {
    if (er instanceof Error) {
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

const singleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.singleUserFromDb(id as string);

    console.log("Reuslt : ", result);

    res.status(200).json({
      success: true,
      message: "Specific User Retrive Successfully!",
      data: result,
    });
  } catch (er) {
    if (er instanceof Error) {
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

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.updateUser(req.body, id as string);

    res.status(200).json({
      success: true,
      message: "User Data Update Successfully!",
      data: result,
    });
  } catch (er) {
    if (er instanceof Error) {
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id as string);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User Delete Successfully!",
    });
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

export const userController = {
  createUser,
  getAllUser,
  singleUser,
  updateUser,
  deleteUser,
};
