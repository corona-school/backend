import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';
import { achievement_type_enum, achievement_action_type_enum } from '@prisma/client';

enum achievement_state {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
}

registerEnumType(achievement_state, {
    name: 'achievement_state',
});

registerEnumType(achievement_action_type_enum, {
    name: 'achievement_action_type_enum',
});

registerEnumType(achievement_type_enum, {
    name: 'achievement_type_enum',
});

@ObjectType()
class Achievement {
    @Field()
    id: number;

    @Field()
    name: string;

    @Field({ nullable: true })
    subtitle?: string | null;

    @Field()
    description: string;

    @Field()
    image: string;

    @Field()
    alternativeText: string;

    @Field(() => achievement_action_type_enum, { nullable: true })
    actionType?: achievement_action_type_enum | null;

    @Field(() => achievement_type_enum)
    achievementType: achievement_type_enum;

    @Field(() => achievement_state)
    achievementState: achievement_state;

    @Field(() => [Step], { nullable: true })
    steps?: Step[] | null;

    @Field(() => Int)
    maxSteps: number;

    @Field(() => Int)
    currentStep?: number;

    @Field({ nullable: true })
    isNewAchievement?: boolean | null;

    @Field({ nullable: true })
    achievedText?: string | null;

    @Field({ nullable: true })
    progressDescription?: string | null;

    @Field({ nullable: true })
    streakProgress?: string | null;

    @Field({ nullable: true })
    actionName?: string | null;

    @Field({ nullable: true })
    actionRedirectLink?: string | null;
}

@ObjectType()
class Step {
    @Field()
    name: string;

    @Field({ nullable: true })
    isActive?: boolean | null;
}

export { Achievement, Step, achievement_state };
