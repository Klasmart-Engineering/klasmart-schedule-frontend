import { useReducer } from "react";
import { stateProps } from "../types/scheduleTypes";

const initialState: stateProps = {
  type: "daily",
  daily: {
    interval: 0,
    end: {
      type: "never",
      after_count: 0,
      after_time: Date.now(),
    },
  },
  weekly: {
    interval: 0,
    on: ["Sunday"],
    end: {
      type: "never",
      after_count: 0,
      after_time: Date.now(),
    },
  },
  monthly: {
    interval: 10,
    on_type: "date",
    on_date_day: 0,
    on_week_seq: "first",
    on_week: "Sunday",
    end: {
      type: "never",
      after_count: 0,
      after_time: Date.now(),
    },
  },
  yearly: {
    interval: 0,
    on_type: "date",
    on_date_month: 1,
    on_date_day: 1,
    on_week_month: 1,
    on_week_seq: "first",
    on_week: "Sunday",
    end: {
      type: "never",
      after_count: 0,
      after_time: Date.now(),
    },
  },
};

interface actionProps {
  type: string;
  data: any;
}

function reducer(state: stateProps, action: actionProps) {
  switch (action.type) {
    case "changeData":
      return action.data;
    default:
      return state;
  }
}

export function useRepeatSchedule() {
  const [state, dispatchRepeat] = useReducer(reducer, initialState);
  return [state, dispatchRepeat];
}
