import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getAlertTimesByDuration, getNextQuarterHour } from "./utils/time";
import { Pool, QueryResult } from "pg";
import bodyParser from "body-parser";

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

app.use(bodyParser.json());

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

interface TimeEntry {
  id: number;
  startTime: Date;
  endTime: Date;
  duration: number;
  userId: number;
}

app.get("/timeentry/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "select * from time_entry where user_id = $1",
      [userId]
    );
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving time entries from database");
  }
});

const createTimeEntry = async (
  timeEntry: TimeEntry
): Promise<QueryResult<{ id: number }>> => {
  const { userId, startTime, endTime } = timeEntry;
  return await pool.query(
    "insert into time_entry (start_time, end_time, user_id) values ($1, $2, $3) returning id",
    [startTime, endTime, userId]
  );
};

const deleteTimeEntry = async (id: number): Promise<QueryResult<[]>> => {
  return await pool.query("delete from time_entry where id = $1", [id]);
};

app.post("/timeentry", async (req: Request, res: Response) => {
  debugger;
  console.log("req.body", req.body);
  const timeEntry: TimeEntry = req.body;
  try {
    const result = await createTimeEntry(timeEntry);
    res.status(201).send({ status: "success", id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: error, message: "Failed to create time entry" });
  }
});

app.delete("/timeentry/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await deleteTimeEntry(parseInt(id));
    if (result.rowCount === 1) {
      res.send({ status: "success" });
    } else {
      res.status(404).send({
        status: "error",
        message: `No time entry found with id ${id}`,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: "error", message: "Failed to delete time entry" });
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
