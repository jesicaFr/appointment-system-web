import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Box,
  VStack,
  Text,
} from '@chakra-ui/react'
import { useCreateAppointmentMutation, useUpdateAppointmentMutation } from '../appointmentApiSlice'
import type { Appointment, AppointmentCreateDto } from '../types'

const schema = z.object({
  patientName: z.string().min(1, 'Required'),
  date: z.string().min(1, 'Required'),
  time: z.string().min(1, 'Required'),
  reason: z.string().min(1, 'Required'),
})

type FormValues = z.infer<typeof schema>

const today = new Date().toISOString().slice(0, 10)

type CreateAppointmentFormProps = {
  appointment?: Appointment
  onDone?: () => void
}

export const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = ({ appointment, onDone }) => {
  const [create, { isLoading: isCreating }] = useCreateAppointmentMutation()
  const [updateAppointment, { isLoading: isUpdating }] = useUpdateAppointmentMutation()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientName: appointment?.patientName ?? '',
      date: appointment?.appointmentDate.slice(0, 10) ?? '',
      time: appointment?.appointmentDate.slice(11, 16) ?? '',
      reason: appointment?.reason ?? '',
    },
  })

  useEffect(() => {
    reset({
      patientName: appointment?.patientName ?? '',
      date: appointment?.appointmentDate.slice(0, 10) ?? '',
      time: appointment?.appointmentDate.slice(11, 16) ?? '',
      reason: appointment?.reason ?? '',
    })
  }, [appointment, reset])

  const selectedDate = watch('date')
  const now = new Date()
  const nowTime = now.toTimeString().slice(0, 5)
  const timeMin = appointment ? undefined : selectedDate === today ? nowTime : undefined
  const isEditMode = Boolean(appointment)

  const onSubmit = async (values: FormValues) => {
    if (!isEditMode) {
      if (values.date < today) {
        toast({ title: 'Invalid date', description: 'Please select today or a future date.', status: 'error', duration: 3000, isClosable: true })
        return
      }

      const startDateTime = new Date(`${values.date}T${values.time}`)
      if (startDateTime < new Date()) {
        toast({ title: 'Invalid time', description: 'Please select a future time.', status: 'error', duration: 3000, isClosable: true })
        return
      }

      const start = startDateTime.toISOString()
      const dto: AppointmentCreateDto = {
        patientName: values.patientName,
        AppointmentDate: start,
        Reason: values.reason,
      }

      try {
        await create(dto).unwrap()
        toast({ title: 'Appointment created', status: 'success', duration: 3000, isClosable: true })
        reset()
      } catch (e) {
        toast({ title: 'Error creating appointment', status: 'error', duration: 3000, isClosable: true })
      }
      return
    }

    if (appointment?.isCancelled) {
      toast({ title: 'Already cancelled', description: 'This appointment is already cancelled.', status: 'info', duration: 3000, isClosable: true })
      return
    }

    try {
      await updateAppointment({ id: appointment.id, isCancelled: true }).unwrap()
      toast({ title: 'Appointment cancelled', status: 'success', duration: 3000, isClosable: true })
      if (onDone) onDone()
    } catch (e) {
      toast({ title: 'Error cancelling appointment', status: 'error', duration: 3000, isClosable: true })
    }
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          {isEditMode && (
            <Text color="gray.600" fontSize="sm" mb={2}>
              You can only cancel this appointment. All other fields are read-only.
            </Text>
          )}
          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
              Patient Name
            </FormLabel>
            <Input
              placeholder="Enter patient name"
              {...register('patientName')}
              isReadOnly={isEditMode}
              focusBorderColor="purple.500"
              border="1px solid"
              borderColor="gray.300"
              rounded="md"
              _hover={{ borderColor: 'gray.400' }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
              Date
            </FormLabel>
            <Input
              type="date"
              min={today}
              {...register('date')}
              isReadOnly={isEditMode}
              focusBorderColor="purple.500"
              border="1px solid"
              borderColor="gray.300"
              rounded="md"
              _hover={{ borderColor: 'gray.400' }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
              Time
            </FormLabel>
            <Input
              type="time"
              min={timeMin}
              {...register('time')}
              isReadOnly={isEditMode}
              focusBorderColor="purple.500"
              border="1px solid"
              borderColor="gray.300"
              rounded="md"
              _hover={{ borderColor: 'gray.400' }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
              Reason
            </FormLabel>
            <Textarea
              placeholder="Describe the reason for the appointment..."
              {...register('reason')}
              isReadOnly={isEditMode}
              focusBorderColor="purple.500"
              border="1px solid"
              borderColor="gray.300"
              rounded="md"
              _hover={{ borderColor: 'gray.400' }}
              minH="24"
            />
          </FormControl>

          <Button
            colorScheme="purple"
            type="submit"
            isLoading={isCreating || isUpdating}
            isDisabled={isEditMode && appointment?.isCancelled}
            w="full"
            h="10"
            fontSize="md"
            fontWeight="600"
            mt={4}
            _hover={{
              shadow: 'lg',
              transform: 'translateY(-1px)',
            }}
            transition="all 0.2s"
          >
            {isEditMode ? (appointment?.isCancelled ? 'Already Cancelled' : 'Cancel Appointment') : 'Schedule Appointment'}
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default CreateAppointmentForm
