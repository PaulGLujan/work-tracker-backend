export interface CreateAppointment {
  title?: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  userId: number;
}

export interface Appointment extends CreateAppointment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
