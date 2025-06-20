import { Field, InputType, ObjectType } from 'type-graphql';

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export const DAYS: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export type IWeeklyAvailability = {
    [key in Day]: DayAvailabilitySlot[];
};

@InputType('DayAvailabilitySlot')
@ObjectType()
export class DayAvailabilitySlot {
    @Field(() => String)
    from: string;
    @Field(() => String)
    to: string;
}

@InputType('WeeklyAvailability')
@ObjectType()
export class WeeklyAvailability implements IWeeklyAvailability {
    @Field(() => [DayAvailabilitySlot])
    monday: DayAvailabilitySlot[];
    @Field(() => [DayAvailabilitySlot])
    tuesday: DayAvailabilitySlot[];
    @Field(() => [DayAvailabilitySlot])
    wednesday: DayAvailabilitySlot[];
    @Field(() => [DayAvailabilitySlot])
    thursday: DayAvailabilitySlot[];
    @Field(() => [DayAvailabilitySlot])
    friday: DayAvailabilitySlot[];
    @Field(() => [DayAvailabilitySlot])
    saturday: DayAvailabilitySlot[];
    @Field(() => [DayAvailabilitySlot])
    sunday: DayAvailabilitySlot[];
}

@InputType('CalendarPreferences')
@ObjectType()
export class CalendarPreferences {
    @Field(() => WeeklyAvailability)
    weeklyAvailability: WeeklyAvailability;
}
