import React, { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useAppSelector } from '../../../store/hooks'
import { Button, Box, Text, useToast } from '@chakra-ui/react'
import { useGetAppointmentsQuery, useUpdateAppointmentMutation } from '../appointmentApiSlice'
import type { Appointment } from '../types'

export const CalendarView: React.FC<{ onAppointmentSelect?: (appointment: Appointment) => void }> = ({ onAppointmentSelect }) => {
  const filters = useAppSelector((s) => s.ui)
  const [selected, setSelected] = useState<Appointment | null>(null)
  const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation()
  const toast = useToast()
  const { data } = useGetAppointmentsQuery({
    status: filters.statusFilter === 'all' ? undefined : filters.statusFilter === 'active' ? 'Active' : 'Cancelled',
    from: filters.dateRange.from,
    to: filters.dateRange.to,
  })

  const events = useMemo(() => {
    if (!data) return []
    return data.map((a) => ({
      id: String(a.id),
      title: `${a.patientName}${a.reason ? ` • ${a.reason}` : ''}`,
      start: a.appointmentDate,
      allDay: false,
      display: 'block',
      backgroundColor: a.isCancelled ? '#9ca3af' : '#22c55e',
      borderColor: a.isCancelled ? '#6b7280' : '#16a34a',
      extendedProps: { appointment: a },
    }))
  }, [data])

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
        events={events}
        eventClick={(info) => {
          info.jsEvent.preventDefault()
          const appointment = info.event.extendedProps.appointment as Appointment | undefined
          if (appointment) {
            setSelected(appointment)
            if (onAppointmentSelect) onAppointmentSelect(appointment)
          }
        }}
        nowIndicator={true}
        height="auto"
      />
      {selected && (
        <Box mt={4} p={3} borderWidth={1} borderRadius="md" borderColor="gray.200" bg="white">
          <Text fontSize="sm" color="gray.700">{selected.patientName} — {new Date(selected.appointmentDate).toLocaleString()}</Text>
          <Button
            mt={2}
            colorScheme="red"
            onClick={async () => {
              if (selected.isCancelled) {
                toast({ title: 'Already cancelled', status: 'info', duration: 3000, isClosable: true })
                return
              }
              try {
                await updateAppointment({ id: selected.id, isCancelled: true }).unwrap()
                toast({ title: 'Appointment cancelled', status: 'success', duration: 3000, isClosable: true })
                setSelected(null)
              } catch (e) {
                toast({ title: 'Error cancelling appointment', status: 'error', duration: 3000, isClosable: true })
              }
            }}
            isLoading={isUpdating}
          >
            Cancel Appointment
          </Button>
        </Box>
      )}
    </div>
  )
}

export default CalendarView
