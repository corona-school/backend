import * as _ from "lodash";
import { shouldRemindAtDate } from "./timecontrol";


function createDateWithRandomTime(day,month,year) {
    if (!_.inRange(day, 0, 32) || !_.inRange(month, 1, 13)) {
        return null;
    }

    const hour = _.random(0, 23);
    const minute = _.random(0, 59);
    const second = _.random(0, 59);
    return new Date(year, month-1, day, hour, minute, second);
}

describe("Screening Reminder Time Handling", () => {

    test("Dates which are dates to send reminders or not", () => {
        const christmasEve = createDateWithRandomTime(24,12,2020);
        const christmas = createDateWithRandomTime(25,12,2023);
        const christmas2nd = createDateWithRandomTime(26,12,2023);
        const newYear = createDateWithRandomTime(1,1,2021);
        const weekendDate1 = createDateWithRandomTime(13,6,2020);
        const corpusChristi = createDateWithRandomTime(11,6,2020);
        const assumptionDay = createDateWithRandomTime(15,8,2020);

        const weekday1 = createDateWithRandomTime(12,6,2020);
        const weekday2 = createDateWithRandomTime(2,7,2020);
        const weekday3 = createDateWithRandomTime(9,10,2020);
        const weekday4 = createDateWithRandomTime(30,12,2025);
        const weekday5 = createDateWithRandomTime(23,12,2024);
        const weekday6 = createDateWithRandomTime(5,2,2030);

        expect(shouldRemindAtDate(christmasEve)).toBeFalsy();
        expect(shouldRemindAtDate(christmas)).toBeFalsy();
        expect(shouldRemindAtDate(christmas2nd)).toBeFalsy();
        expect(shouldRemindAtDate(newYear)).toBeFalsy();
        expect(shouldRemindAtDate(weekendDate1)).toBeFalsy();
        expect(shouldRemindAtDate(corpusChristi)).toBeFalsy();
        expect(shouldRemindAtDate(assumptionDay)).toBeFalsy();

        expect(shouldRemindAtDate(weekday1)).toBeTruthy();
        expect(shouldRemindAtDate(weekday2)).toBeTruthy();
        expect(shouldRemindAtDate(weekday3)).toBeTruthy();
        expect(shouldRemindAtDate(weekday4)).toBeTruthy();
        expect(shouldRemindAtDate(weekday5)).toBeTruthy();
        expect(shouldRemindAtDate(weekday6)).toBeTruthy();
    });
});