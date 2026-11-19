import express, { type Application, type Request, type Response } from "express"
import { Pool } from "pg"

const app: Application = express()
const port = 5000

// Middleware 
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded())

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_0Roe4KJOvaMj@ep-silent-waterfall-azf8rkgb-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require"
})

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT,
        is_Active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT  NOW()
      )
      `)

    console.log("Database Connected!!")
  }
  catch (er) {
    console.log("Error Message : ", er)
  }
}

initDB()

app.get('/', (req: Request, res: Response) => {
  res.send('This is Root Route')
})

app.post("/api/v1/users", async (res: Response, req: Request) => {
  const { name, email, password, age } = req.body

  const result = await pool.query(`
      INSERT INTO users (name, email, password, age)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `,
    [name, email, password, age]
  )

  res.status(200).json({
    success: true,
    message: "User Create Successfully!!",
    data: result
  })

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})