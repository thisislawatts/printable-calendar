import dayjs from "dayjs";
const langNl = require("dayjs/locale/nl");
const localeData = require("dayjs/plugin/localeData");
const weekOfYear = require("dayjs/plugin/weekOfYear");

dayjs.locale("nl");
dayjs.extend(localeData);
dayjs.extend(weekOfYear);

function capitalize(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function getWeekday(date) {
  return dayjs(date).day();
}

function getNumberOfDaysInMonth(year, month) {
  return dayjs(`${year}-${month}-01`).daysInMonth();
}

function createDaysForMonth(year, month, isCurrentMonth = false) {
  const days = [];

  for (let index = 0; index < getNumberOfDaysInMonth(year, month); index++) {
    const date = dayjs(`${year}-${month}-${index + 1}`);
    days.push({
      date: date.format("YYYY-MM-DD"),
      dayOfMonth: date.format("D"),
      isCurrentMonth
    });
  }

  return days;
}

function createDaysForCurrentMonth(year, month) {
  return createDaysForMonth(year, month, true);
}

function createDaysForPreviousMonth(year, month, currentMonthDays) {
  const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date);
  const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");

  // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
  const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday
    ? firstDayOfTheMonthWeekday - 1
    : 6;

  if (!visibleNumberOfDaysFromPreviousMonth) {
    return [];
  }

  return createDaysForMonth(
    previousMonth.format("YYYY"),
    previousMonth.format("MM"),
    false
  ).slice(visibleNumberOfDaysFromPreviousMonth * -1);
}

function createDaysForNextMonth(year, month, currentMonthDays) {
  const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");
  return createDaysForMonth(
    nextMonth.format("YYYY"),
    nextMonth.format("M"),
    false
  );
}

function getDaysForSingleSheet(year, month) {
  let currentMonthDays = createDaysForCurrentMonth(year, month);
  let previousMonthDays = createDaysForPreviousMonth(
    year,
    month,
    currentMonthDays
  );
  let nextMonthDays = createDaysForNextMonth(year, month, currentMonthDays);

  return [
    ...previousMonthDays,
    ...currentMonthDays,
    ...nextMonthDays.slice(
      0,
      42 - (previousMonthDays.length + currentMonthDays.length)
    )
  ];
}

export function generateCalendar(
  startingYear: number,
  startingMonth: number,
  numberOfMonths: number
) {
  let selectedMonth = dayjs(new Date(startingYear, startingMonth - 1, 1));
  const months = [];
  let i = 0;

  while (i < numberOfMonths) {
    const title = dayjs(selectedMonth).format("MMMM YYYY");
    months.push({
      title: capitalize(title),
      days: getDaysForSingleSheet(
        selectedMonth.format("YYYY"),
        selectedMonth.format("M")
      )
    });

    selectedMonth = dayjs(selectedMonth).add(1, "month");
    i++;
  }

  return {
    weekdayHeadings: [
      ...Array.from(langNl.weekdays).slice(1),
      ...Array.from(langNl.weekdays).slice(0, 1)
    ].map(capitalize),
    months
  };
}
