import moment from "moment";

export function getFourWeeks() {
  const now = moment();
  const day = now.isoWeekday();
  const startOfThisWeek = moment(now).startOf("isoWeek");
  let res = [];
  if (day !== 1) {
    res.push(`${startOfThisWeek.unix()}-${moment(now).startOf("day").unix()}`);
  }
  const weeksArr = Array(day === 1 ? 4 : 3).fill(null);
  res = res.concat(
    weeksArr.map(() => {
      return `${startOfThisWeek.subtract(7, "days").unix()}-${startOfThisWeek.clone().endOf("isoWeek").add(1, "second").unix()}`;
    })
  );
  return res.reverse();
}

export function getDurationByDay(day: number) {
  const currentDate = moment().startOf("day").unix();
  return `${currentDate - 3600 * 24 * day}-${currentDate}`;
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
  const day = moment().get("date");
  const startOfThisMonth = moment().startOf("months");
  let res = [];
  index === 3 && res.push(`${startOfThisMonth.unix()}-${moment().unix()}`);
  if (day !== 1 && index !== 3) {
    res.push(`${startOfThisMonth.unix()}-${moment().startOf("date").unix()}`);
  }
  const monthsArr = Array(day === 1 && index !== 3 ? index : index - 1).fill(null);
  res = res.concat(
    monthsArr.map(() => {
      return `${startOfThisMonth.subtract(1, "months").unix()}-${startOfThisMonth.clone().endOf("months").add(1, "second").unix()}`;
    })
  );
  return res.reverse();
}
