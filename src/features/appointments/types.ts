export interface Appointment {
  id: number
  patientName: string
  appointmentDate: string 
  reason?: string
  isCancelled: boolean
}

export interface AppointmentCreateDto {
  patientName: string
  AppointmentDate: string 
  Reason: string
}
