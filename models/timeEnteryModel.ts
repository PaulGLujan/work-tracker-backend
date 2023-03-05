export interface CreateTimeEntry {
  startTime: Date;
  endTime: Date;
  userId: number;
}

export interface TimeEntry extends CreateTimeEntry {
  id: number;
  duration: {
    minutes: "number";
  };
  createdAt: Date;
  updatedAt: Date;
}
