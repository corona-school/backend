import { Arg, Authorized, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { Achievement_template as AchievementTemplate } from '../generated';
import { GraphQLInt } from 'graphql';
import {
    AchievementTemplateCreate,
    AchievementTemplateUpdate,
    activateAchievementTemplate,
    createTemplate,
    deactivateAchievementTemplate,
    updateAchievementTemplate,
} from '../../common/achievement/template';
import { ensureNoNullObject } from '../util';
import { AchievementActionType, AchievementTemplateFor, AchievementType } from '../../common/achievement/types';
import { Role } from '../authorizations';

@InputType()
class AchievementTemplateCreateInput implements AchievementTemplateCreate {
    @Field({ nullable: true })
    tagline: string | null;
    @Field()
    title: string;
    @Field({ nullable: true })
    footer: string | null;
    @Field({ nullable: true })
    achievedFooter: string | null;
    @Field({ nullable: true })
    achievedDescription: string | null;
    @Field({ nullable: true })
    achievedImage: string | null;
    @Field()
    description: string;
    @Field({ nullable: true })
    subtitle: string | null;
    @Field({ nullable: true })
    sequentialStepName: string | null;
    @Field()
    image: string;

    @Field()
    condition: string;
    @Field()
    conditionDataAggregations: string;
    @Field()
    type: AchievementType;
    @Field()
    templateFor: AchievementTemplateFor;
    @Field()
    group: string;
    @Field()
    groupOrder: number;

    @Field({ nullable: true })
    actionName: string | null;
    @Field({ nullable: true })
    actionRedirectLink: string | null;
    @Field({ nullable: true })
    actionType: AchievementActionType | null;
}

@InputType()
class AchievementTemplateUpdateInput implements AchievementTemplateUpdate {
    @Field({ nullable: true })
    tagline: string | null;
    @Field({ nullable: true })
    title: string | null;
    @Field({ nullable: true })
    footer: string | null;
    @Field({ nullable: true })
    achievedFooter: string | null;
    @Field({ nullable: true })
    description: string | null;
    @Field({ nullable: true })
    achievedDescription: string | null;
    @Field({ nullable: true })
    achievedImage: string | null;
    @Field({ nullable: true })
    subtitle: string | null;
    @Field({ nullable: true })
    sequentialStepName: string | null;
    @Field({ nullable: true })
    image: string | null;

    @Field({ nullable: true })
    condition: string | null;
    @Field({ nullable: true })
    conditionDataAggregations: string | null;
    @Field({ nullable: true })
    type: AchievementType | null;
    @Field({ nullable: true })
    templateFor: AchievementTemplateFor | null;
    @Field({ nullable: true })
    group: string | null;
    @Field({ nullable: true })
    groupOrder: number | null;

    @Field({ nullable: true })
    actionName: string | null;
    @Field({ nullable: true })
    actionRedirectLink: string | null;
    @Field({ nullable: true })
    actionType: AchievementActionType | null;
}

@Resolver((of) => AchievementTemplate)
export class MutateAchievementTemplateResolver {
    @Mutation((returns) => GraphQLInt)
    @Authorized(Role.ADMIN)
    async achievementTemplateCreate(@Arg('data', () => AchievementTemplateCreateInput) inputData: AchievementTemplateCreateInput) {
        const data: AchievementTemplateCreate = {
            ...inputData,
            conditionDataAggregations: JSON.parse(inputData.conditionDataAggregations),
        };
        const id = await createTemplate(data);
        return id;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async achievementTemplateUpdate(
        @Arg('achievementTemplateId', (type) => GraphQLInt) achievementTemplateId: number,
        @Arg('update') updateData: AchievementTemplateUpdateInput
    ) {
        // TODO: Currently one cannot set a field back to null :/
        const update: AchievementTemplateUpdate = {
            ...updateData,
            conditionDataAggregations: updateData.conditionDataAggregations ? JSON.parse(updateData.conditionDataAggregations) : undefined,
        };
        await updateAchievementTemplate(achievementTemplateId, ensureNoNullObject(update));
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async achievementTemplateActivate(@Arg('achievementTemplateId', (type) => GraphQLInt) achievementTemplateId: number) {
        await activateAchievementTemplate(achievementTemplateId);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async achievementTemplateDeactivate(@Arg('achievementTemplateId', (type) => GraphQLInt) achievementTemplateId: number) {
        await deactivateAchievementTemplate(achievementTemplateId);
        return true;
    }
}
