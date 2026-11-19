import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";

const app: Application = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_0Roe4KJOvaMj@ep-silent-waterfall-azf8rkgb-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require",
});

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
      `);

    console.log("Database Connected!!");
  } catch (er) {
    console.log("Error Message : ", er);
  }
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("This is Root Route");
});

app.post("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;

    const result = await pool.query(
      `
      INSERT INTO users (name, email, password, age)
      VALUES($1, $2, $3, $4)
      RETURNING *
    `,
      [name, email, password, age],
    );

    console.log("Result: ", result);

    res.status(200).json({
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
});

app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
        SELECT * FROM users
      `);

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
});

app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        SELECT * FROM users
        WHERE id = $1
      `,
      [id],
    );

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
});

app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, password, age, is_Active } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET
        name = COALESCE($1, name),
        password = COALESCE($2, password),
        age = COALESCE($3, age),
        is_Active = COALESCE($4, is_Active)
      WHERE id = $5 RETURNING *
    `,
      [name, password, age, is_Active, id],
    );

    res.status(200).json({
      success: true,
      message: "User Data Update Successfully!",
      data: result,
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
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
