import moment from "moment";

export function getFourWeeks() {
  const now = moment();
  const startOfThisWeek = moment(now).startOf("isoWeek");
  let res = [];
  res.push(`${startOfThisWeek.unix()}-${moment(now).unix()}`);
  const weeksArr = Array(3).fill(null);
  res = res.concat(
    weeksArr.map(() => {
      return `${startOfThisWeek.subtract(7, "days").unix()}-${startOfThisWeek.clone().endOf("isoWeek").add(1, "second").unix()}`;
    })
  );
  return res.reverse();
}

export function getSingleOfFourWeeks() {
  return [moment().subtract(4, "week").unix(), moment().unix()];
}

export function getDurationByDay(day: number) {
  return `${moment()
    .subtract(day - 1, "days")
    .startOf("day")
    .unix()}-${moment().unix()}`;
}

export function getTimeDots() {
  const currentDate = new Date();
  var month = currentDate.getMonth() + 1;
  switch (month) {
    case 1:
      return [11, 12, 1];
    case 2:
      return [12, 1, 2];
    default:
      return [parseInt(`${month - 2}`), parseInt(`${month - 1}`), parseInt(`${month}`)];
  }
}

export function getLastedMonths(index: number) {
  const startOfThisMonth = moment().startOf("months");
  let res = [];
  res.push(`${startOfThisMonth.unix()}-${moment().unix()}`);
  const monthsArr = Array(index - 1).fill(null);
  res = res.concat(
    monthsArr.map(() => {
      return `${startOfThisMonth.subtract(1, "months").unix()}-${startOfThisMonth.clone().endOf("months").add(1, "second").unix()}`;
    })
  );
  return res.reverse();
}

export function getAWeek() {
  return [moment().subtract(6, "days").startOf("day").unix() + "-" + moment().unix()];
}
