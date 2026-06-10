import React, { useState } from 'react'
import { Box, Button, Flex, Heading, Text, VStack, Icon } from '@chakra-ui/react'
import { CalendarIcon, AddIcon, ArrowBackIcon } from '@chakra-ui/icons'
import CalendarView from './CalendarView'
import CreateAppointmentForm from './CreateAppointmentForm'
import type { Appointment } from '../types'

type ViewMode = 'menu' | 'calendar' | 'create'

const AppointmentsPage: React.FC = () => {
  const [view, setView] = useState<ViewMode>('menu')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  if (view === 'menu') {
    return (
      <Flex align="center" justify="center" h="80vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
        <Box bg="white" p={10} rounded="lg" shadow="2xl" w="full" maxW="md">
          <Heading size="lg" mb={2} color="gray.800">
            Appointments
          </Heading>
          <Text color="gray.500" mb={8} fontSize="sm">
            Select an action to continue
          </Text>

          <VStack spacing={4}>
            <Button
              w="full"
              h="24"
              colorScheme="blue"
              onClick={() => setView('calendar')}
              flexDirection="column"
              gap={3}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              <Icon as={CalendarIcon} fontSize="2xl" />
              <VStack spacing={0}>
                <Text fontWeight="bold" fontSize="md">View Calendar</Text>
                <Text fontSize="xs" opacity={0.8}>See all appointments</Text>
              </VStack>
            </Button>

            <Button
              w="full"
              h="24"
              colorScheme="green"
              onClick={() => setView('create')}
              flexDirection="column"
              gap={3}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              <Icon as={AddIcon} fontSize="2xl" />
              <VStack spacing={0}>
                <Text fontWeight="bold" fontSize="md">Create Appointment</Text>
                <Text fontSize="xs" opacity={0.8}>Add a new appointment</Text>
              </VStack>
            </Button>
          </VStack>
        </Box>
      </Flex>
    )
  }

  if (view === 'calendar') {
    return (
      <Box p={4}>
        <Button
          mb={4}
          leftIcon={<ArrowBackIcon />}
          onClick={() => {
            setSelectedAppointment(null)
            setView('menu')
          }}
          variant="ghost"
        >
          Back to Menu
        </Button>
        <Box bg="white" p={4} rounded="lg" shadow="md">
          <Heading size="md" mb={4}>
            Calendar View
          </Heading>
          <CalendarView
            onAppointmentSelect={(appointment) => {
              setSelectedAppointment(appointment)
              setView('create')
            }}
          />
        </Box>
      </Box>
    )
  }

  if (view === 'create') {
    return (
      <Box p={4}>
        <Button
          mb={4}
          leftIcon={<ArrowBackIcon />}
          onClick={() => {
            setSelectedAppointment(null)
            setView('menu')
          }}
          variant="ghost"
        >
          Back to Menu
        </Button>
        <Box bg="white" p={6} rounded="lg" shadow="md" maxW="md">
          <Heading size="md" mb={4}>
            {selectedAppointment ? 'Edit Appointment' : 'Create Appointment'}
          </Heading>
          <CreateAppointmentForm
            appointment={selectedAppointment ?? undefined}
            onDone={() => {
              setSelectedAppointment(null)
              setView('calendar')
            }}
          />
        </Box>
      </Box>
    )
  }

  return null
}

export default AppointmentsPage
