import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Appointment, AppointmentCreateDto } from './types'

export const appointmentApi = createApi({
  reducerPath: 'appointmentApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL || 'https://localhost:7290/api' }),
  tagTypes: ['Appointment'],
  endpoints: (builder) => ({
    getAppointments: builder.query<Appointment[], { status?: string; from?: string; to?: string }>({
      query: (filters) => {
        const params = new URLSearchParams()
        if (filters?.status) params.append('status', filters.status)
        if (filters?.from) params.append('from', filters.from)
        if (filters?.to) params.append('to', filters.to)
        const qs = params.toString()
        return `/appointments${qs ? `?${qs}` : ''}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((a) => ({ type: 'Appointment' as const, id: a.id })),
              { type: 'Appointment' as const, id: 'LIST' },
            ]
          : [{ type: 'Appointment' as const, id: 'LIST' }],
    }),
    createAppointment: builder.mutation<Appointment, AppointmentCreateDto>({
      query: (body) => ({ url: '/appointments', method: 'POST', body }),
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    updateAppointment: builder.mutation<void, Partial<Appointment> & { id: number }>({
      query: ({ id, ...patch }) => ({ url: `/appointments/${id}`, method: 'PUT', body: patch }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Appointment', id }, { type: 'Appointment', id: 'LIST' }],
    }),
  }),
})

export const { useGetAppointmentsQuery, useCreateAppointmentMutation, useUpdateAppointmentMutation } = appointmentApi
