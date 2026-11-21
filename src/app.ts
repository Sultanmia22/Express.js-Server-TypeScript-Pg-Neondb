import express, { type Application, type Request, type Response } from "express"
import { initDB, pool } from "./db";
import { userRoute } from "./modules/users/router";
const app: Application = express();

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded())

initDB()

app.get("/", (req: Request, res: Response) => {
  res.send("This is Root Route");
}); 

export default app