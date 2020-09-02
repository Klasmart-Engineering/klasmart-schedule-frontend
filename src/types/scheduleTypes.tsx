export type timestampType = {
  start: number;
  end: number;
};

export interface RouteParams {
  rightside: "scheduleTable" | "scheduleList";
  model: "edit" | "preview";
}

export type modeViewType = "month" | "day" | "workWeek" | "week";

export type repeatOptionsType = "only_current" | "with_following";

type endType = {
  type: string;
  after_count: number;
  after_time: number;
};

type dailyType = {
  interval: number;
  end: endType;
};

type weeklyType = {
  interval: number;
  on: string[];
  end: endType;
};

type monthlyType = {
  interval: number;
  on_type: string;
  on_date_day: number;
  on_week_seq: string;
  on_week: string;
  end: endType;
};

type yearlyType = {
  interval: number;
  on_type: string;
  on_date_month: number;
  on_date_day: number;
  on_week_month: number;
  on_week_seq: string;
  on_week: string;
  end: endType;
};
export interface stateProps {
  type: string;
  daily: dailyType;
  weekly: weeklyType;
  monthly: monthlyType;
  yearly: yearlyType;
}
