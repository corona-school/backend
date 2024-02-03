import { Authorized, Query, Resolver } from 'type-graphql';
import { Achievement_template as AchievementTemplate } from '../generated';
import { getAllTemplates } from '../../common/achievement/template';
import { Role } from '../roles';

@Resolver((of) => AchievementTemplate)
export class AchievementTemplateFieldResolver {
    @Query((returns) => [AchievementTemplate])
    @Authorized(Role.UNAUTHENTICATED)
    async achievementTemplates() {
        // The achievements maintained is generally public knowledge
        // We might want to keep the conditions private in some cases ("gamification"),
        // but whoever is smart enough to query the GraphQL API deserves whatever achievement
        // they want to achieve
        return await getAllTemplates();
    }
}
