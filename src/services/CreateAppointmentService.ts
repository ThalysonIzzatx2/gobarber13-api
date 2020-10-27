import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../erros/AppError';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRpository';

interface RequestDTO {
  provider_id: string,
  date: Date,
}

class CreateAppointmentService {

  public async execute({ date, provider_id }: RequestDTO): Promise<Appointment> {
    const appointmentRepository = getCustomRepository(AppointmentRepository);

    const appointmentDate = startOfHour(date);
    const findAppointmentsInSameDate = await appointmentRepository.findByDate(
      appointmentDate
    );

    if(findAppointmentsInSameDate) {
      throw new AppError('This appointment is already booked');
    }
    const appointment = appointmentRepository.create({
      provider_id,
      date:appointmentDate,
    });

    await appointmentRepository.save(appointment);

    return appointment
  }
}

export default CreateAppointmentService;