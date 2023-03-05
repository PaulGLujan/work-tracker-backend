import express, { Request, Response } from "express";
import {
  createTimeEntry,
  deleteTimeEntry,
  getTimeEntryByUserId,
} from "../controllers/timeEntryController";
import { CreateTimeEntry } from "../models/timeEnteryModel";

const router = express.Router();

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await getTimeEntryByUserId(userId);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving time entries from database");
  }
});

router.post("/", async (req: Request, res: Response) => {
  const timeEntry: CreateTimeEntry = req.body;
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

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await deleteTimeEntry(id);
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

export default router;
