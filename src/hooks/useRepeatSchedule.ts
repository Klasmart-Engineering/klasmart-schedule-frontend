import { useReducer } from "react";

const initialState: any = {
  type: "yearly",
  daily: {
    interval: 0,
    end: {
      type: "never",
      after_count: 0,
      after_time: 0,
    },
  },
  weekly: {
    interval: 0,
    on: ["Sunday"],
    end: {
      type: "never",
      after_count: 0,
      after_time: 0,
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
      after_time: 0,
    },
  },
  yearly: {
    interval: 0,
    on_type: "date",
    on_date_month: 0,
    on_date_day: 0,
    on_week_month: 1,
    on_week_seq: "first",
    on_week: "Sunday",
    end: {
      type: "never",
      after_count: 0,
      after_time: 0,
    },
  },
};

interface stateProps {
  type: string;
  daily: {
    interval: number;
    end: {
      type: string;
      after_count: number;
      after_time: number;
    };
  };
  weekly: {
    interval: number;
    on: string[];
    end: {
      type: string;
      after_count: number;
      after_time: number;
    };
  };
  monthly: {
    interval: number;
    on_type: string;
    on_date_day: number;
    on_week_seq: string;
    on_week: string;
    end: {
      type: string;
      after_count: number;
      after_time: number;
    };
  };
  yearly: {
    interval: number;
    on_type: string;
    on_date_month: number;
    on_date_day: number;
    on_week_month: number;
    on_week_seq: string;
    on_week: string;
    end: {
      type: string;
      after_count: number;
      after_time: number;
    };
  };
}

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
