import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getAlertTimesByDuration, getNextQuarterHour } from "./utils/time";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ?? "5432"),
});

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("select * from users");
    res.send(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users from database");
  }
});

app.get("/alertTimes/:startTime/:duration", (req: Request, res: Response) => {
  const { duration, startTime } = req.params;
  const startTimeDate = new Date(Number(startTime));
  const nextQuarterHour = getNextQuarterHour(startTimeDate);
  const durationString = Number(duration);
  res.send(getAlertTimesByDuration(nextQuarterHour, durationString));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
