import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';
import { achievement_action_type_enum as GraphQLAchievementActionTypeEnum, achievement_type_enum as GraphQLAchievementTypeEnum } from '../generated';
import { PublicAchievement, PublicStep, AchievementState, AchievementType, AchievementActionType } from '../../common/achievement/types';

registerEnumType(AchievementState, {
    name: 'achievement_state',
});

@ObjectType()
export class Achievement implements PublicAchievement {
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

    @Field(() => GraphQLAchievementActionTypeEnum, { nullable: true })
    actionType?: AchievementActionType | null;

    @Field(() => GraphQLAchievementTypeEnum)
    achievementType: AchievementType;

    @Field(() => AchievementState)
    achievementState: AchievementState;

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
export class Step implements PublicStep {
    @Field()
    name: string;

    @Field({ nullable: true })
    isActive?: boolean | null;
}
