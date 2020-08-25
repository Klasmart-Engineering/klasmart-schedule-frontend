import { useReducer } from "react";

const initialState: any = {
  cycle: "monthly",
  cycleTime: 1,
  weekdays: ['Monday'],
  onThe: "the",
  specificDayChange: 2,
  order: "second",
  weekday: "Saturday",
  month: "November",
  endRepeat: "occurrence",
  occurrence: 10,
  time: "2020-05-24T10:30",
};

interface stateProps {
  cycle: string;
  cycleTime: number;
  weekdays: Array<string>;
  onThe: string;
  specificDayChange: number;
  order: string;
  weekday: string;
  month: string;
  endRepeat: string;
  occurrence: number;
  time: string;
}

interface actionProps {
  type: string;
  data: any;
}

function reducer(state: stateProps, action: actionProps) {
  switch (action.type) {
    case "changeOnThe":
      return { ...state, onThe: action.data };
    case "handelSpecificDayChange":
      return { ...state, specificDayChange: action.data };
    case "handleOrderChange":
      return { ...state, order: action.data };
    case "handleWeekdayChange":
      return { ...state, weekday: action.data };
    case "handleMonthChange":
      return { ...state, month: action.data };
    case "handelleEndRepeatChange":
      return { ...state, endRepeat: action.data };
    case "handleOccurrenceChange":
      return { ...state, occurrence: action.data };
    case "handleChangeCycle":
      return { ...state, cycle: action.data };
    case "handleChangeCycleTime":
      return { ...state, cycleTime: action.data };
    case "handleWeekdaySelect":
      return { ...state, weekdays: action.data };
    case "handleTimeChange":
      return { ...state, time: action.data };
    default:
      return state;
  }
}

export function useRepeatSchedule() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return [state, dispatch];
}
