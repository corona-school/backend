import * as Holidays from "date-holidays";
import { getLogger } from "log4js";

const logger = getLogger();

// ----------------------------------------------------
// German public holiday check
// ----------------------------------------------------
function publicHolidayInGermany(atDate: Date): Holidays.Holiday | false {
    const hd = new Holidays("DE");

    return hd.isHoliday(atDate);
}


// ----------------------------------------------------
// the checks for public holidays (by country)
// ----------------------------------------------------
function checkPublicHolidayInGermany(atDate: Date): boolean {
    const hd = publicHolidayInGermany(atDate);

    if (hd) {
        logger.info(`Will not send screening reminders today, because there's a public holiday in Germany, to be specific: ${hd.name}`);
        return false;
    }

    return true;
}
function checkPublicHoliday(atDate: Date): boolean {
    return checkPublicHolidayInGermany(atDate);
}

// ----------------------------------------------------
// the checks for weekends
// ----------------------------------------------------
function checkWeekend(atDate: Date): boolean {
    const isWeekend = (atDate.getDay() == 6) || (atDate.getDay() == 0);

    if (isWeekend) {
        logger.info(`Will not send screening reminders today, because it's weekend...`);
    }

    return !isWeekend;
}

// -------------
// main function
// -------------
export function shouldRemindAtDate(date: Date): boolean {
    return checkPublicHoliday(date)
            && checkWeekend(date);
}