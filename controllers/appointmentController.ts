import { QueryResult } from "pg";
import { pool } from "../db";
import { CreateAppointment, Appointment } from "../models/appointmentModel";

export const createAppointment = async (
  appointment: CreateAppointment
): Promise<QueryResult<{ id: number }>> => {
  const {
    title = "",
    description = "",
    startTime,
    endTime,
    userId,
  } = appointment;
  return await pool.query(
    "insert into appointment (title, description, start_time, end_time, user_id) values ($1, $2, $3, $4, $5) returning id",
    [title, description, startTime, endTime, userId]
  );
};

export const getAppointmentByUserId = async (
  userId: number | string
): Promise<QueryResult<Appointment>> => {
  return await pool.query("select * from appointment where user_id = $1", [
    userId,
  ]);
};

export const deleteAppointmentById = async (
  id: number | string
): Promise<QueryResult<[]>> => {
  return await pool.query("delete from appointment where id = $1", [id]);
};
