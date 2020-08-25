import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { Schedule } from "../api/api";

interface ScheduleState {
  scheduleDetail: Schedule
}

interface RootState1 {
  schedules: Array<Schedule>
}
const initialState: any = {
  lists: [
    {
      id: '111',
      title: '222',
      start_at: 1598320554,
      end_at: 1598325554,
      lesson_plan: {
        name: 'lesson'
      },
      teachers: [{
        name: '111'
      }],
      theme: 'ssssss'
    }
  ]
}

export const getSearchList = createAsyncThunk<any>( '/schedules', (id, {getState}) => {
  return api.schedules.queryschedules({teacher_id: `${id}`})
})

const {reducer} = createSlice({
  name: "schedule",
  initialState,
  reducers: {},
  extraReducers: {
    [getSearchList.fulfilled.type]: (state, {payload}: PayloadAction<RootState1>) => {
      state.lists = payload
    },
    [getSearchList.rejected.type]: (state, {error}: any) => {
      console.log(error)
    }
  }
})

export default reducer