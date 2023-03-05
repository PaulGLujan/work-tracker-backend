import { QueryResult } from "pg";
import { CreateTimeEntry, TimeEntry } from "../models/timeEnteryModel";
import { pool } from "../db";

export const getTimeEntryByUserId = async (
  userId: number | string
): Promise<QueryResult<TimeEntry>> => {
  return await pool.query("select * from time_entry where user_id = $1", [
    userId,
  ]);
};

export const createTimeEntry = async (
  timeEntry: CreateTimeEntry
): Promise<QueryResult<{ id: number }>> => {
  const { userId, startTime, endTime } = timeEntry;
  return await pool.query(
    "insert into time_entry (start_time, end_time, user_id) values ($1, $2, $3) returning id",
    [startTime, endTime, userId]
  );
};

export const deleteTimeEntry = async (
  id: number | string
): Promise<QueryResult<[]>> => {
  return await pool.query("delete from time_entry where id = $1", [id]);
};
