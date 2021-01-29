import { User } from "../api/api-ko-schema.auto";

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
};

export function formatTime(seconds: number) {
  const date = new Date(seconds * 1000);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const second = date.getSeconds();
  return `${year}/${month}/${day}  ${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${second
    .toString()
    .padStart(2, "0")}`;
}

export function formatTimeToMonWek(seconds: number) {
  const date = new Date(seconds * 1000);
  const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
  const weekArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const month = monthArr[date.getMonth()];
  const day = date.getDate();
  const week = weekArr[date.getDay()];
  return `${month}  ${day},  ${week}`;
}

export function formatTimeToHourMin(seconds: number) {
  const date = new Date(seconds * 1000);
  const hour = date.getHours();
  const min = date.getMinutes();
  return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}
