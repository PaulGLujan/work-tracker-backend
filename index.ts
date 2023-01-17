import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { getAlertTimesByDuration, getNextQuarterHour } from './utils/time';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.get('/alertTimes/:startTime/:duration', (req: Request, res: Response) => {
    const { duration, startTime } = req.params;
    const startTimeDate = new Date(Number(startTime));
    const nextQuarterHour = getNextQuarterHour(startTimeDate);
    const durationString = Number(duration);
    res.send(getAlertTimesByDuration(nextQuarterHour, durationString));
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
