import * as _ from "lodash";
import {shouldRemindAtDate} from "../../../../../jobs/periodic/screening-reminder/timecontrol";
import * as assert from "assert";


function createDateWithRandomTime(day, month, year) {
    if (!_.inRange(day, 0, 32) || !_.inRange(month, 1, 13)) {
        return null;
    }

    const hour: number = _.random(0, 23);
    const minute: number = _.random(0, 59);
    const second: number = _.random(0, 59);
    return new Date(year, month - 1, day, hour, minute, second);
}

describe("Screening Reminder Time Handling", function() {
    this.timeout(5000);

    it("Dates which are dates to send reminders or not", function() {
        // Arrange
        const christmasEve = createDateWithRandomTime(24, 12, 2020);
        const christmas = createDateWithRandomTime(25, 12, 2023);
        const christmas2nd = createDateWithRandomTime(26, 12, 2023);
        const newYear = createDateWithRandomTime(1, 1, 2021);
        const weekendDate1 = createDateWithRandomTime(13, 6, 2020);
        const corpusChristi = createDateWithRandomTime(11, 6, 2020);
        const assumptionDay = createDateWithRandomTime(15, 8, 2020);

        const weekday1 = createDateWithRandomTime(12, 6, 2020);
        const weekday2 = createDateWithRandomTime(2, 7, 2020);
        const weekday3 = createDateWithRandomTime(9, 10, 2020);
        const weekday4 = createDateWithRandomTime(30, 12, 2025);
        const weekday5 = createDateWithRandomTime(23, 12, 2024);
        const weekday6 = createDateWithRandomTime(5, 2, 2030);

        //Act, Assert
        assert.strictEqual(shouldRemindAtDate(christmasEve), false);
        assert.strictEqual(shouldRemindAtDate(christmas), false);
        assert.strictEqual(shouldRemindAtDate(christmas2nd), false);
        assert.strictEqual(shouldRemindAtDate(newYear), false);
        assert.strictEqual(shouldRemindAtDate(weekendDate1), false);
        assert.strictEqual(shouldRemindAtDate(corpusChristi), false);
        assert.strictEqual(shouldRemindAtDate(assumptionDay), false);

        assert.strictEqual(shouldRemindAtDate(weekday1), true);
        assert.strictEqual(shouldRemindAtDate(weekday2), true);
        assert.strictEqual(shouldRemindAtDate(weekday3), true);
        assert.strictEqual(shouldRemindAtDate(weekday4), true);
        assert.strictEqual(shouldRemindAtDate(weekday5), true);
        assert.strictEqual(shouldRemindAtDate(weekday6), true);
    });
});
