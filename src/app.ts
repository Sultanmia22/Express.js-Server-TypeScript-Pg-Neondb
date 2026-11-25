import express, { type Application, type NextFunction, type Request, type Response } from "express"
import { initDB, pool } from "./db";
import { userRoute } from "./modules/users/router";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import fs from "fs"
import logger from "./middleware/logger";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded())
app.use(logger)

initDB()

app.use("/api/v1/users",userRoute)
app.use("/api/v1/profile",profileRoute)
app.use("/api/v1/auth",authRoute)

app.get("/", (req: Request, res: Response) => {
  res.send("This is Root Route");
}); 

app.use(globalErrorHandler)

export default app