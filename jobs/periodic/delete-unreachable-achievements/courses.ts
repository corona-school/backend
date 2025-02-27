import { getLogger } from '../../../common/logger/logger';
import { EventRelationType, createRelation, parseRelation } from '../../../common/achievement/relation';
import { prisma } from '../../../common/prisma';
import tracer from '../../../common/logger/tracing';
import { subcourseOver } from '../../../common/courses/states';
import { getSubcourse } from '../../../graphql/util';

const logger = getLogger('CourseAchievementCleanup');

const ParticipationGroupTemplate = 'pupil_course_participation';

export const deleteUnreachableCourseAchievements = tracer.wrap('delete', _deleteUnreachableCourseAchievements);
async function _deleteUnreachableCourseAchievements(dryRun: boolean = true) {
    const till = new Date();
    till.setDate(till.getDate() - 1);

    const unachievedAchievementes = await prisma.user_achievement.findMany({
        where: {
            template: {
                group: ParticipationGroupTemplate,
            },
            achievedAt: null,
        },
    });

    const relationToUserIds: { [key: string]: string[] } = unachievedAchievementes.reduce((acc, curr) => {
        if (!acc[curr.relation]) {
            acc[curr.relation] = [];
        }
        acc[curr.relation].push(curr.userId);
        return acc;
    }, {});

    logger.info('found possibly unachievable achievements', {
        courses: relationToUserIds,
        search_till: till,
    });

    for (const [relation, userIds] of Object.entries(relationToUserIds)) {
        const [relationType, subcourseId] = parseRelation(relation);
        if (relationType !== EventRelationType.Subcourse) {
            logger.warn('unexpected relation type', {
                relation,
            });
            continue;
        }

        const subcourse = await getSubcourse(subcourseId, false);
        if (!subcourse.cancelled && !(await subcourseOver(subcourse))) {
            logger.debug('skipping active subcourse', {
                relation,
                till,
            });
            continue;
        }

        logger.info('deleting pupil course participation achievements', {
            relation,
            user_ids: userIds,
        });

        if (!dryRun) {
            // When a user joins a course, the first achievement in the sequence will be marked as achieved, and the second will be created.
            // This delete will job consider all courses that ended at most a day ago, ensuring that users can't achieve the second step in the sequence anymore.
            // So we'll have to delete all achievements in the sequence; achieved and unachieved.
            await prisma.user_achievement.deleteMany({
                where: {
                    userId: { in: userIds },
                    relation,
                    template: {
                        group: ParticipationGroupTemplate,
                    },
                },
            });
        }
    }
}
