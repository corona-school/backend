import { Day, WeeklyAvailability } from '../../graphql/types/calendarPreferences';

export const getSharedWeeklyAvailability = (availabilityA: WeeklyAvailability, availabilityB: WeeklyAvailability) => {
    const sharedAvailability: WeeklyAvailability = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    };
    Object.keys(sharedAvailability).forEach((day: Day) => {
        const slotsA = availabilityA[day] || [];
        const slotsB = availabilityB[day] || [];
        const tempSharedSlots = {};
        slotsA.forEach((slot) => {
            const slotKey = `${slot.from}-${slot.to}`;
            tempSharedSlots[slotKey] = slot;
        });
        slotsB.forEach((slot) => {
            const slotKey = `${slot.from}-${slot.to}`;
            if (tempSharedSlots[slotKey]) {
                sharedAvailability[day].push(tempSharedSlots[slotKey]);
            }
        });
    });
    return sharedAvailability;
};
