import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { getAlertTimesByDuration, getNextQuarterHour } from "./utils/time";
import bodyParser from "body-parser";
import { pool } from "./db";
import timeEntryRouter from "./routes/timeEntryRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.json());

// Routers
app.use("/timeentry", timeEntryRouter);

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
