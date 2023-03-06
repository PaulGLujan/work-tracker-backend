import express, { Request, Response } from "express";
import {
  getAppointmentByUserId,
  createAppointment,
  deleteAppointmentById,
} from "../controllers/appointmentController";
import { CreateAppointment } from "../models/appointmentModel";

const router = express.Router();

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await getAppointmentByUserId(userId);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving appointments from database");
  }
});

router.post("/", async (req: Request, res: Response) => {
  const appointment: CreateAppointment = req.body;
  try {
    const result = await createAppointment(appointment);
    res.status(201).send({ status: "success", id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: error, message: "Failed to create appointment" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await deleteAppointmentById(id);
    if (result.rowCount === 1) {
      res.send({ status: "success" });
    } else {
      res.status(404).send({
        status: "error",
        message: `No appointment found with id ${id}`,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: error, message: "Failed to delete an appointment" });
  }
});

export default router;
