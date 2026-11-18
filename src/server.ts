import express, { type Application, type Request, type Response } from "express"
import {Pool} from "pg"

const app: Application = express()
const port = 5000

// Middleware 
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded())

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_0Roe4KJOvaMj@ep-silent-waterfall-azf8rkgb-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

app.get('/', (req: Request, res: Response) => {
  res.send('This is Root Route')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})