import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DateRange {
  from?: string
  to?: string
}

interface UIState {
  statusFilter: 'all' | 'active' | 'cancelled'
  dateRange: DateRange
}

const initialState: UIState = {
  statusFilter: 'all',
  dateRange: {},
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<UIState['statusFilter']>) {
      state.statusFilter = action.payload
    },
    setDateRange(state, action: PayloadAction<DateRange>) {
      state.dateRange = action.payload
    },
    resetFilters(state) {
      state.statusFilter = 'all'
      state.dateRange = {}
    },
  },
})

export const { setStatusFilter, setDateRange, resetFilters } = uiSlice.actions
export default uiSlice.reducer
