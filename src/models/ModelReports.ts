import { ReactNode } from "react";
import { School, User } from "../api/api-ko-schema.auto";
import { EntityReportListTeachingLoadItem, EntityStudentAchievementReportCategoryItem } from "../api/api.auto";
import { HorizontalBarStackDataItem } from "../components/Chart/HorizontalBarStackChart";
import { d } from "../locale/LocaleManager";
import { teacherLoadDescription } from "../pages/ReportTeachingLoad/TeacherLoadChart";
interface formatTeachingLoadListResponse {
  formatedData: HorizontalBarStackDataItem[];
  xLabels?: string[][];
}

export const ModelReport = {
  teacherListSetDiff(teacherList: Pick<User, "user_id" | "user_name">[]): Pick<User, "user_id" | "user_name">[] {
    let hash: Record<string, boolean> = {};
    teacherList = teacherList.reduce((preVal: Pick<User, "user_id" | "user_name">[], curVal) => {
      if (!hash[curVal.user_id]) {
        hash[curVal.user_id] = true;
        preVal.push(curVal);
      }
      return preVal;
    }, []);
    return teacherList;
  },
  schoolListSetDiff(schoolList: Pick<School, "school_id" | "school_name">[]): Pick<School, "school_id" | "school_name">[] {
    let hash: Record<string, boolean> = {};
    schoolList = schoolList.reduce((preVal: Pick<School, "school_id" | "school_name">[], curVal) => {
      if (!hash[curVal.school_id]) {
        hash[curVal.school_id] = true;
        preVal.push(curVal);
      }
      return preVal;
    }, []);
    return schoolList;
  },
};

export function formatTime(seconds: number | undefined) {
  if (!seconds) return "";
  const date = new Date(seconds * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const second = date.getSeconds();
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}  ${hour
    .toString()
    .padStart(2, "0")}:${min.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
}
enum formatTimeToMonWekType {
  hasTh = "hasTh",
}
export function formatTimeToMonWek(seconds: number, type?: string) {
  const date = new Date(seconds * 1000);
  const monthArr = [
    d("Jan").t("schedule_calendar_jan"),
    d("Feb").t("schedule_calendar_feb"),
    d("Mar").t("schedule_calendar_mar"),
    d("Apr").t("schedule_calendar_apr"),
    d("May").t("schedule_calendar_may"),
    d("Jun").t("schedule_calendar_jun"),
    d("Jul").t("schedule_calendar_jul"),
    d("Aug").t("schedule_calendar_aug"),
    d("Sep").t("schedule_calendar_sep"),
    d("Oct").t("schedule_calendar_oct"),
    d("Nov").t("schedule_calendar_nov"),
    d("Dec").t("schedule_calendar_dec"),
  ];
  // const weekArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekFullNameArr = [
    d("Sunday").t("schedule_frequency_sunday"),
    d("Monday").t("schedule_frequency_monday"),
    d("Tuesday").t("schedule_frequency_tuesday"),
    d("Wednesday").t("schedule_frequency_wednesday"),
    d("Thursday").t("schedule_frequency_thursday"),
    d("Friday").t("schedule_frequency_friday"),
    d("Saturday").t("schedule_frequency_saturday"),
  ];
  const month = monthArr[date.getMonth()];
  const day = date.getDate();
  // const week = weekArr[date.getDay()];
  const weekFullName = weekFullNameArr[date.getDay()];
  if (type === formatTimeToMonWekType.hasTh) {
    return `${month} ${day}th,${weekFullName}`;
  }
  return `${month}  ${day},  ${weekFullName}`;
}

enum Type {
  date = "date",
  time = "time",
}
export function formatTimeToEng(seconds: number, type?: string) {
  if (!seconds) return "";
  const date = new Date(seconds * 1000);
  const year = date.getFullYear();
  const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
  const month = monthArr[date.getMonth()];
  const day = date.getDate();
  const h = date.getHours();
  const dayType = h > 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h;
  const min = date.getMinutes();
  if (type === Type.date) {
    return `${month}  ${day},  ${year}`;
  }
  if (type === Type.time) {
    return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")} ${dayType}`;
  }
}

export function formatTimeToHourMin(seconds: number) {
  const date = new Date(seconds * 1000);
  const hour = date.getHours();
  const min = date.getMinutes();
  return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}
export function formatTimeToMonDay(seconds: number) {
  const date = new Date(seconds * 1000);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month.toString().padStart(2, "0")}.${day.toString().padStart(2, "0")}`;
}

interface Time2colorLevelResponse {
  opacity: number;
  hour: number;
  min: number;
}
export function time2colorLevel(seconds: number): Time2colorLevelResponse {
  if (seconds === 0) return { opacity: 0.1, hour: 0, min: 0 };
  const hour = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  let opacity = 1;
  if (hour < 2) {
    opacity = 0.25;
  } else if (hour < 4) {
    opacity = 0.45;
  } else if (hour < 6) {
    opacity = 0.7;
  }
  return { opacity, hour, min };
}
export function formatTeachingLoadList(data: EntityReportListTeachingLoadItem[]): formatTeachingLoadListResponse {
  let formatedData: HorizontalBarStackDataItem[] = [];
  formatedData = data.map((dataItem) => {
    return {
      id: dataItem.teacher_id || "",
      name: dataItem.teacher_name || "",
      description: "",
      value: dataItem.durations
        ? dataItem.durations.map((durationItems, idx) => {
            const total = (durationItems?.online || 0) + (durationItems?.offline || 0);
            const { opacity } = time2colorLevel(total);
            const description: ReactNode = teacherLoadDescription({ ...durationItems });
            return {
              name: `category-${idx}`,
              value: 10,
              color: `rgba(0,98,255,${opacity})`,
              description: description,
            };
          })
        : [],
    };
  });
  const xLabels = data[0].durations?.map((items) => {
    return formatTimeToMonWek && formatTimeToMonWek(items.end_at || 0, formatTimeToMonWekType.hasTh).split(",");
  });
  return { formatedData, xLabels };
}

export function getAchievementDetailEmptyStatus(data: EntityStudentAchievementReportCategoryItem[]): boolean {
  return data && data.length ? data.every((item) => !item.achieved_items && !item.not_achieved_items && !item.not_attempted_items) : false;
}

export function deDuplicate(arr: Pick<User, "user_id" | "user_name">[]) {
  let obj: { [key: string]: boolean } = {};
  return arr.reduce<Pick<User, "user_id" | "user_name">[]>((item, next) => {
    if (!obj[next.user_id]) {
      item.push(next);
      obj[next.user_id] = true;
    }
    return item;
  }, []);
}

export function getTimeOffSecond() {
  const timeOff = new Date().getTimezoneOffset();
  return -timeOff * 60;
}
