import express, { type Application, type NextFunction, type Request, type Response } from "express"
import { initDB, pool } from "./db";
import { userRoute } from "./modules/users/router";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import fs from "fs"

const app: Application = express();

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded())

app.use((req: Request, res: Response, next: NextFunction) => {

  const log = `\nMethod: ${req.method} | URL: ${req.url} | Time: ${Date.now()}\n`

  fs.appendFile("logger.txt",log,(er) => {
    console.log(er)
  })

  // console.log("Log:",log)
  next();
});

initDB()

app.use("/api/v1/users",userRoute)
app.use("/api/v1/profile",profileRoute)
app.use("/api/v1/auth",authRoute)

app.get("/", (req: Request, res: Response) => {
  res.send("This is Root Route");
}); 



export default app