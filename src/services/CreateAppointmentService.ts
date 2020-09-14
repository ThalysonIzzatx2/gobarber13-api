import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRpository';

interface RequestDTO {
  provider: string,
  date: Date,
}

class CreateAppointmentService {
  private appointmentRepository: AppointmentRepository;

  constructor(appointmentRepository: AppointmentRepository) {
    this.appointmentRepository = appointmentRepository;
  }

  public execute({ date, provider }: RequestDTO): Appointment {
    const appointmentDate = startOfHour(date);
    const findAppointmentsInSameDate = this.appointmentRepository.findByDate(
      appointmentDate
    );

    if(findAppointmentsInSameDate) {
      throw Error('This appointment is already booked');
    }
    const appointment = this.appointmentRepository.create({
      provider,
      date:appointmentDate,
    });

    return appointment
  }
}

export default CreateAppointmentService;