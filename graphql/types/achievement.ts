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

    @Field()
    subtitle: string;

    @Field()
    description: string;

    @Field()
    image: string;

    @Field()
    alternativeText: string;

    @Field(() => achievement_action_type_enum, { nullable: true })
    actionType?: achievement_action_type_enum;

    @Field(() => achievement_type_enum)
    achievementType: achievement_type_enum;

    @Field(() => achievement_state)
    achievementState: achievement_state;

    @Field(() => [Step], { nullable: true })
    steps?: Step[];

    @Field(() => Int)
    maxSteps: number;

    @Field(() => Int)
    currentStep?: number;

    @Field({ nullable: true })
    isNewAchievement?: boolean;

    @Field({ nullable: true })
    progressDescription?: string;

    @Field({ nullable: true })
    actionName?: string;

    @Field({ nullable: true })
    actionRedirectLink?: string;
}

@ObjectType()
class Step {
    @Field()
    name: string;

    @Field({ nullable: true })
    isActive?: boolean;
}

export { Achievement, Step, achievement_state };
