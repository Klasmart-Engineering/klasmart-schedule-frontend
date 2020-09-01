export type timestampType = {
  start: number;
  end: number;
};

export interface RouteParams {
  rightside: "scheduleTable" | "scheduleList";
  model: "edit" | "preview";
}

export type modeViewType = "month" | "day" | "workWeek" | "week";

export interface stateProps {
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
