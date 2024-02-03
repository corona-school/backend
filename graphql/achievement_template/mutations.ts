import { Arg, Authorized, Field, InputType, Mutation, Resolver } from 'type-graphql';
import {
    Achievement_template as AchievementTemplate,
    achievement_template_for_enum as AchievementTemplateForEnum,
    achievement_type_enum as AchievementTypeEnum,
    Achievement_templateUpdateInput,
} from '../generated';
import { Role } from '../roles';
import { GraphQLInt } from 'graphql';
import {
    AchievementTemplateCreate,
    AchievementTemplateUpdate,
    activateAchievementTemplate,
    deactivateAchievementTemplate,
    getTemplate,
    purgeAchievementTemplateCache,
    updateAchievementTemplate,
} from '../../common/achievement/template';
import { achievement_action_type_enum, Prisma, achievement_type_enum, achievement_template_for_enum } from '@prisma/client';
import { ensureNoNullObject } from '../util';

@InputType()
class AchievementTemplateCreateInput implements AchievementTemplateCreate {
    @Field()
    name: string;
    @Field({ nullable: true })
    achievedText: string | null;
    @Field()
    description: string;
    @Field()
    subtitle: string;
    @Field()
    stepName: string;
    @Field()
    image: string;

    @Field()
    condition: string;
    @Field()
    conditionDataAggregations: Prisma.JsonValue;
    @Field()
    type: achievement_type_enum;
    @Field()
    templateFor: achievement_template_for_enum;
    @Field()
    group: string;
    @Field()
    groupOrder: number;

    @Field({ nullable: true })
    actionName: string | null;
    @Field({ nullable: true })
    actionRedirectLink: string | null;
    @Field({ nullable: true })
    actionType: achievement_action_type_enum | null;
}

@InputType()
class AchievementTemplateUpdateInput implements AchievementTemplateUpdate {
    @Field({ nullable: true })
    name: string;
    @Field({ nullable: true })
    achievedText: string | null;
    @Field({ nullable: true })
    description: string | null;
    @Field({ nullable: true })
    subtitle: string | null;
    @Field({ nullable: true })
    stepName: string | null;
    @Field({ nullable: true })
    image: string | null;

    @Field({ nullable: true })
    condition: string | null;
    @Field({ nullable: true })
    conditionDataAggregations: Prisma.JsonValue | null;
    @Field({ nullable: true })
    type: achievement_type_enum | null;
    @Field({ nullable: true })
    templateFor: achievement_template_for_enum | null;
    @Field({ nullable: true })
    group: string | null;
    @Field({ nullable: true })
    groupOrder: number | null;

    @Field({ nullable: true })
    actionName: string | null;
    @Field({ nullable: true })
    actionRedirectLink: string | null;
    @Field({ nullable: true })
    actionType: achievement_action_type_enum | null;
}

@Resolver((of) => AchievementTemplate)
export class MutateAchievementTemplateResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async achievementTemplateCreate(
        @Arg('achievementTemplateId', (type) => GraphQLInt) achievementTemplateId: number,
        @Arg('data') data: AchievementTemplateCreateInput
    ) {
        await activateAchievementTemplate(achievementTemplateId);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async achievementTemplateUpdate(
        @Arg('achievementTemplateId', (type) => GraphQLInt) achievementTemplateId: number,
        @Arg('update') update: AchievementTemplateUpdateInput
    ) {
        // TODO: Currently one cannot set a field back to null :/
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
