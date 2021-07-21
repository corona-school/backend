import Holidays from "date-holidays";
import { getLogger } from "log4js";
import moment from "moment-timezone";

const logger = getLogger();

// ----------------------------------------------------
// Holiday stuff
// ----------------------------------------------------
/// This will only respect the day, not the hour (e.g. christmas eve is usually only a holiday after 2 pm, but no one wants to screen at christmas eve)
function isHolidayAtDate(holiday: Holidays.Holiday, date: Date) {
    //holiday duration ROUNDED UP to at least one day
    const startOfStart = moment(holiday.start).startOf("day");
    const holidayDuration = Math.ceil(moment(holiday.end).clone()
        .diff(startOfStart, "days", true));

    //the start and end time on a daily granularity, such that if a holiday actually begins at 2pm, the start time will be 0am (if holiday ends at 4pm, end time will be 11.59pm)
    const start = startOfStart;
    const end = startOfStart.clone().add(holidayDuration, "days");

    //check now, if the date is at the same day as the holiday
    const isHD = moment(date).isBetween(start, end, undefined, "[]");

    if (isHD) {
        return holiday;
    }
    return false;
}

// ----------------------------------------------------
// German public holiday check
// ----------------------------------------------------
function isCommonHolidayInAnyStateOfGermany(date: Date): Holidays.Holiday | false {
    const de = "DE";
    const allStates = Object.keys(new Holidays().getStates(de));

    //all holidays is each state of Germany in the year of the date
    const allHolidays: Holidays.Holiday[] = allStates.reduce((a, s) => a.concat(...(new Holidays(de, s).getHolidays(date.getFullYear()))), []);

    return allHolidays.find(hd => isHolidayAtDate(hd, date));
}


// ----------------------------------------------------
// the checks for public holidays (by country)
// ----------------------------------------------------
function performCheckForCommonHolidayInGermany(atDate: Date): boolean {
    const hd = isCommonHolidayInAnyStateOfGermany(atDate);

    if (hd) {
        logger.info(`Will not send screening reminders today, because there's a public holiday in Germany, to be specific: ${hd.name}`);
        return false;
    }

    return true;
}
function performCheckForCommonHolidays(atDate: Date): boolean {
    return performCheckForCommonHolidayInGermany(atDate);
}

// ----------------------------------------------------
// the checks for weekends
// ----------------------------------------------------
function performCheckForWeekends(atDate: Date): boolean {
    const isWeekend = (atDate.getDay() == 6) || (atDate.getDay() == 0);

    if (isWeekend) {
        logger.info(`Will not send screening reminders today, because it's weekend...`);
    }

    return !isWeekend; //check not successful if it's weekend
}

// -------------
// main function
// -------------
export function shouldRemindAtDate(date: Date): boolean {
    return performCheckForCommonHolidays(date)
            && performCheckForWeekends(date);
}