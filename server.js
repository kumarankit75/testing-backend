import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// GET NOTES
app.get("/notes", async (req, res) => {
  const result = await pool.query("SELECT * FROM notes ORDER BY created_at DESC");
  res.json(result.rows);
});

// ADD NOTE
app.post("/notes", async (req, res) => {
  const { text } = req.body;
  const result = await pool.query(
    "INSERT INTO notes(text) VALUES($1) RETURNING *",
    [text]
  );
  res.json(result.rows[0]);
});

// DELETE NOTE
app.delete("/notes/:id", async (req, res) => {
  await pool.query("DELETE FROM notes WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running"));