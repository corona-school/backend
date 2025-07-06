import { Day, DAYS, DayAvailabilitySlot, WeeklyAvailability } from '../../graphql/types/calendarPreferences';

const mergeSlots = (slots: DayAvailabilitySlot[]) => {
    slots.sort((a, b) => a.from - b.from);

    const merged = [];
    for (const slot of slots) {
        const last = merged[merged.length - 1];

        if (last && slot.from <= last.to) {
            merged[merged.length - 1] = {
                from: last.from,
                to: Math.max(last.to, slot.to),
            };
        } else {
            merged.push({ ...slot });
        }
    }

    return merged;
};

export const getOverlappingHoursCount = (availabilityA: WeeklyAvailability, availabilityB: WeeklyAvailability) => {
    let count = 0;
    for (const day of DAYS) {
        const slotsA = mergeSlots(availabilityA[day] || []);
        const slotsB = mergeSlots(availabilityB[day] || []);

        for (const slotA of slotsA) {
            for (const slotB of slotsB) {
                const overlapStart = Math.max(slotA.from, slotB.from);
                const overlapEnd = Math.min(slotA.to, slotB.to);
                const overlapDuration = overlapEnd - overlapStart;

                if (overlapDuration >= 60) {
                    count += 1;
                }
            }
        }
    }

    return count;
};

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
