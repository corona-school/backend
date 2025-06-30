import { Day, DayAvailabilitySlot, WeeklyAvailability } from '../../graphql/types/calendarPreferences';

export const getMatchAvailabilityFromPerspective = (myAvailability: WeeklyAvailability, learningPartnerAvailability: WeeklyAvailability) => {
    const matchAvailability: WeeklyAvailability = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
    };

    Object.keys(matchAvailability).forEach((day: Day) => {
        const slotsA = learningPartnerAvailability[day] || [];
        const slotsB = myAvailability[day] || [];
        const tempMatchSlots = {};
        slotsA.forEach((slot) => {
            const slotKey = `${slot.from}-${slot.to}`;
            tempMatchSlots[slotKey] = { ...slot, isShared: false };
        });
        slotsB.forEach((slot) => {
            const slotKey = `${slot.from}-${slot.to}`;
            if (tempMatchSlots[slotKey]) {
                tempMatchSlots[slotKey] = { ...slot, isShared: !!tempMatchSlots[slotKey] };
            }
        });
        const sortedSlots = (Object.values(tempMatchSlots) as DayAvailabilitySlot[]).sort((a, b) => a.from - b.from);
        matchAvailability[day].push(...sortedSlots);
    });
    return matchAvailability;
};
