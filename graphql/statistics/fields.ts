import { Role } from '../authorizations';
import { Arg, Authorized, Field, FieldResolver, Float, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { PrerequisiteError } from '../../common/util/error';
import { course_category_enum } from '@prisma/client';

@ObjectType()
class ByMonth {
    @Field({ nullable: true }) // null on invalid dates
    year?: number;
    @Field({ nullable: true })
    month?: number;
    @Field({ nullable: true })
    value?: number;

    @Field({ nullable: true })
    group?: string;
}

@ObjectType()
class TimeBuckets {
    @Field()
    num0to14: number;
    @Field()
    num15to28: number;
    @Field()
    num29to60: number;
    @Field()
    num61to120: number;
    @Field()
    num121to300: number;
    @Field()
    numMore: number;
}

@ObjectType()
class TimeSeries {
    @Field({ nullable: true }) // null on invalid dates
    label?: string;
    @Field({ nullable: true })
    value?: number;
}

@ObjectType()
class Statistics {
    @Field({ nullable: true })
    from: string; // ISO Date String
    @Field({ nullable: true })
    to: string; // ISO Date String
}

@Resolver((of) => Statistics)
export class StatisticsResolver {
    @Query((returns) => Statistics)
    @Authorized(Role.ADMIN)
    statistics(@Arg('from', { nullable: true }) from: string = '1970-01-01', @Arg('to', { nullable: true }) to: string = '3000-01-01'): Statistics {
        return { from, to };
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tutorRegistrations(@Root() statistics: Statistics) {
        const result = await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                                     date_part('year', "createdAt"::date)  AS year,
                                                     date_part('month', "createdAt"::date) AS month
                                              FROM "student"
                                              WHERE "isStudent" = TRUE
                                                AND "createdAt" > ${statistics.from}::timestamp
                                                AND "createdAt" < ${statistics.to}::timestamp
                                              GROUP BY "year", "month"
                                              ORDER BY "year" ASC, "month" ASC;`;
        console.log(result);
        return result;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tutorRegistrationsByState(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "state"                               AS group
                                      FROM "student"
                                      WHERE "isStudent" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "state"
                                      ORDER BY "year" ASC, "month" ASC, "state" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tutorRegistrationsByUniversity(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "university"                          AS group
                                      FROM "student"
                                      WHERE "isStudent" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "university"
                                      ORDER BY "year" ASC, "month" ASC, "university" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tuteeRegistrations(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "pupil"
                                      WHERE "isPupil" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tuteeRegistrationsByState(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "state"                               as group
                                      FROM "pupil"
                                      WHERE "isPupil" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "state"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tuteeRegistrationsBySchooltype(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "schooltype"                          as group
                                      FROM "pupil"
                                      WHERE "isPupil" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "schooltype"
                                      ORDER BY "year" ASC, "month" ASC, "schooltype" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tuteeRegistrationsByGrade(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "grade"                               as group
                                      FROM "pupil"
                                      WHERE "isPupil" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "grade"
                                      ORDER BY "year" ASC, "month" ASC, "grade" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tutorScreenings(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "screening"
                                      WHERE "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowMatches(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "match"
                                      WHERE "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowFirstMatches(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "match"
                                      WHERE "pupilId" IN
                                            (SELECT "pupilId" FROM "match" GROUP BY "pupilId" HAVING COUNT(*)::INT = 1)
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowFirstMatchesStudent(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "match"
                                      WHERE "studentId" IN (SELECT "studentId"
                                                            FROM "match"
                                                            GROUP BY "studentId"
                                                            HAVING COUNT(*)::INT = 1)
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowDissolvedMatchesBeforeThreeMonths(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "updatedAt"::date)  AS year,
                                             date_part('month', "updatedAt"::date) AS month
                                      FROM "match"
                                      WHERE dissolved = TRUE
                                        AND date_part('day', "updatedAt"::timestamp - "createdAt"::timestamp) <= 90
                                        AND "updatedAt" > ${statistics.from}::timestamp
                                        AND "updatedAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowDissolvedMatchesAfterThreeMonths(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "updatedAt"::date)  AS year,
                                             date_part('month', "updatedAt"::date) AS month
                                      FROM "match"
                                      WHERE dissolved = TRUE
                                        AND date_part('day', "updatedAt"::timestamp - "createdAt"::timestamp) > 90
                                        AND "updatedAt" > ${statistics.from}::timestamp
                                        AND "updatedAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    // Doesn't work for now as the dissolved reason is completely messed up

    // @FieldResolver((returns) => [ByMonth])
    // @Authorized(Role.ADMIN)
    // async nowDissolvedMatchesByReason(@Root() statistics: Statistics) {
    //    return await prisma.$queryRaw`SELECT
    //            COUNT(*)::INT AS value,
    //            date_part('year', "updatedAt"::date) AS year,
    //            date_part('month', "updatedAt"::date) AS month,
    //            "dissolveReason" as group
    //        FROM "match"
    //            WHERE dissolved = TRUE AND "updatedAt" > ${statistics.from}::timestamp AND "updatedAt" < ${statistics.to}::timestamp
    //            GROUP BY "year", "month", "dissolveReason"
    //            ORDER BY "year" ASC, "month" ASC, "dissolveReason" ASC;`;
    // }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async offeredLectures(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                     AS value,
                                             date_part('year', "start"::date)  AS year,
                                             date_part('month', "start"::date) AS month
                                      FROM "lecture"
                                      WHERE "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async offeredCoursePlaces(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT "year", "month", SUM("subcourse"."maxParticipants")::INT
                                      FROM (SELECT DISTINCT ON ("subcourseId") "subcourseId",
                                                                               "start",
                                                                               date_part('year', "start"::date)  AS "year",
                                                                               date_part('month', "start"::date) AS "month"
                                            FROM "lecture"
                                            WHERE "start" > ${statistics.from}::timestamp
                                              AND "start" < ${statistics.to}::timestamp
                                            ORDER BY "subcourseId", "start") "first_lecture"
                                               INNER JOIN "subcourse" ON "subcourse"."id" = "subcourseId"
                                      GROUP BY "year", "month"
                                      ORDER BY "year", "month";`;
    }

    @FieldResolver(() => [ByMonth])
    @Authorized(Role.ADMIN)
    async numCourses(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "course"
                                      WHERE "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver(() => Int)
    @Authorized(Role.ADMIN)
    async numPupilsAtLeastOneMatch(@Root() statistics: Statistics) {
        return await prisma.pupil.count({
            where: {
                match: { some: {} },
                AND: [{ createdAt: { gte: statistics.from } }, { createdAt: { lte: statistics.to } }],
            },
        });
    }

    @FieldResolver(() => Int)
    @Authorized(Role.ADMIN)
    async numPupilsOnWaitingList(@Root() statistics: Statistics) {
        return await prisma.waiting_list_enrollment.count({
            distinct: 'pupilId',
            where: {
                AND: [{ createdAt: { gte: statistics.from } }, { createdAt: { lte: statistics.to } }],
            },
        });
    }

    @FieldResolver(() => Int)
    @Authorized(Role.ADMIN)
    async numCourseAppointments(@Root() statistics: Statistics, @Arg('category') category: course_category_enum) {
        return await prisma.lecture.count({
            where: {
                subcourse: { course: { category: { equals: category } } },
                AND: [{ createdAt: { gte: statistics.from } }, { createdAt: { lte: statistics.to } }],
            },
        });
    }

    @FieldResolver(() => TimeBuckets)
    @Authorized(Role.ADMIN)
    async timeCommitment(@Root() statistics: Statistics) {
        const matches = await prisma.match.findMany({
            where: { AND: [{ createdAt: { gte: statistics.from } }, { createdAt: { lte: statistics.to } }] },
            orderBy: { createdAt: 'asc' },
        });
        const intervals = new Map<number, number>();
        for (const match of matches) {
            let dateUntil;
            if (!match.dissolved || match.dissolvedAt < match.createdAt) {
                dateUntil = new Date();
            } else {
                dateUntil = match.dissolvedAt;
            }
            const matchLengthInDays = Math.round((dateUntil.getTime() - match.createdAt.getTime()) / (1000 * 60 * 60 * 24));

            intervals.set(match.studentId, matchLengthInDays + (intervals.get(match.studentId) ?? 0));
        }
        const buckets: TimeBuckets = {
            num0to14: 0,
            num15to28: 0,
            num29to60: 0,
            num61to120: 0,
            num121to300: 0,
            numMore: 0,
        };
        intervals.forEach((value, key) => {
            if (value <= 14) {
                buckets.num0to14++;
            } else if (value <= 28) {
                buckets.num15to28++;
            } else if (value <= 60) {
                buckets.num29to60++;
            } else if (value <= 120) {
                buckets.num61to120++;
            } else if (value <= 300) {
                buckets.num121to300++;
            } else {
                buckets.numMore++;
            }
        });
        return buckets;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async attendedCoursePlaces(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT "year", "month", SUM("participants")::INT AS "value"
                                      FROM (SELECT "year",
                                                   "month",
                                                   "subcourse"."id" AS "subcourseId",
                                                   COUNT(*)::INT    AS "participants"
                                            FROM (SELECT DISTINCT ON ("subcourseId") "subcourseId",
                                                                                     "start",
                                                                                     date_part('year', "start"::date)  AS "year",
                                                                                     date_part('month', "start"::date) AS "month"
                                                  FROM "lecture"
                                                  WHERE "start" > ${statistics.from}::timestamp
                                                    AND "start" < ${statistics.to}::timestamp
                                                  ORDER BY "subcourseId", "start") "first_lecture"
                                                     INNER JOIN "subcourse" ON "subcourse"."id" = "subcourseId"
                                                     INNER JOIN "subcourse_participants_pupil"
                                                                ON "subcourse_participants_pupil"."subcourseId" = "subcourse"."id"
                                            GROUP BY "year", "month", "subcourse"."id") "subcourse_participants"
                                      GROUP BY "year", "month"
                                      ORDER BY "year", "month";`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async pupilsParticipatingInCourses(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT "year", "month", COUNT(DISTINCT "pupilId")::INT AS "value"
                                      FROM (SELECT "year", "month", "subcourse_participants_pupil"."pupilId"
                                            FROM (SELECT DISTINCT ON ("subcourseId") "subcourseId",
                                                                                     "start",
                                                                                     date_part('year', "start"::date)  AS "year",
                                                                                     date_part('month', "start"::date) AS "month"
                                                  FROM "lecture"
                                                  WHERE "start" > ${statistics.from}::timestamp
                                                    AND "start" < ${statistics.to}::timestamp
                                                  ORDER BY "subcourseId", "start") "first_lecture"
                                                     INNER JOIN "subcourse" ON "subcourse"."id" = "subcourseId"
                                                     INNER JOIN "subcourse_participants_pupil"
                                                                ON "subcourse_participants_pupil"."subcourseId" = "subcourse"."id"
                                            GROUP BY "year", "month", "subcourse_participants_pupil"."pupilId") "subcourse_participants"
                                      GROUP BY "year", "month"
                                      ORDER BY "year", "month";`;
    }

    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async averageMatchesOfTutee() {
        const tuteesWithMatch = await prisma.pupil.count({ where: { match: { some: {} } } });
        const matchesTotal = await prisma.match.count({});

        return matchesTotal / tuteesWithMatch;
    }

    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async averageMatchesOfTutors() {
        const tutorsWithMatch = await prisma.student.count({ where: { match: { some: {} } } });
        const matchesTotal = await prisma.match.count({});

        return matchesTotal / tutorsWithMatch;
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.ADMIN)
    async activeMatches() {
        return await prisma.match.count({ where: { dissolved: false } });
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async knowsCoronaSchoolFrom(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "knowsCoronaSchoolFrom"               AS group
                                      FROM "screening"
                                      WHERE "success" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "knowsCoronaSchoolFrom"
                                      ORDER BY "year" ASC, "month" ASC, "knowsCoronaSchoolFrom" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async interestConfirmationsByState(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "status"                              AS group
                                      FROM "pupil_tutoring_interest_confirmation_request"
                                      WHERE "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "status"
                                      ORDER BY "year" ASC, "month" ASC, "status" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async pupilScreenings(@Root() statistics: Statistics, @Arg('status') status: number) {
        if (status < 0 || status > 3) {
            throw new PrerequisiteError('Status must be a number between 0 and 3');
        }
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "pupil_screening"
                                      WHERE "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                        AND "status" = '${status}'
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async rateSuccessfulCoCs(@Root() statistics: Statistics) {
        const currentDate = new Date(); // Get the current date
        const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 8, currentDate.getDate());
        const successfulScreeningsCount = await prisma.screening.count({
            where: {
                success: true,
                createdAt: { gte: previousDate },
            },
            distinct: 'studentId',
        });
        const submittedCoCs = await prisma.certificate_of_conduct.count({
            where: { createdAt: { gte: previousDate } },
            distinct: 'studentId',
        });
        return submittedCoCs / successfulScreeningsCount;
    }

    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async rateFirstMatchDissolvedBeforeOneMonth(@Root() statistics: Statistics) {
        const students = await prisma.student.findMany({ select: { match: true } });
        const relevantStudents = students.filter((s) => {
            const firstMatch = s.match.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
            return firstMatch.createdAt > new Date(statistics.to) && firstMatch.createdAt < new Date(statistics.from);
        });
        const numStudentsWithMatches = relevantStudents.reduce((acc, cur) => (cur.match.length > 0 ? acc + 1 : acc), 0);
        const numStudentsFirstMatchDissolvedBeforeOneMonth = relevantStudents.reduce((acc, cur) => {
            const firstMatch = cur.match.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
            if (
                firstMatch.dissolved &&
                firstMatch.dissolvedAt <= new Date(firstMatch.createdAt.getFullYear(), firstMatch.createdAt.getMonth() + 1, firstMatch.createdAt.getDate())
            ) {
                return acc + 1;
            }
            return acc;
        }, 0);
        return numStudentsFirstMatchDissolvedBeforeOneMonth / numStudentsWithMatches;
    }

    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async rateTargetAudience(@Root() statistics: Statistics) {
        const numPupils = await prisma.pupil.count();
        const numSuccessfulScreening = await prisma.pupil_screening.count({
            where: { status: 'success' },
            distinct: 'pupilId',
        });
        return numSuccessfulScreening / numPupils;
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.ADMIN)
    async dissolvedMatchesByReason(@Root() statistics, @Arg('reason') reason: number) {
        return await prisma.match.count({
            where: {
                dissolveReason: reason,
                AND: [{ dissolvedAt: { gte: statistics.from } }, { dissolvedAt: { lte: statistics.to } }],
            },
        });
    }

    @FieldResolver(() => [TimeSeries])
    @Authorized(Role.ADMIN)
    async matchesByDuration(@Root() statistics: Statistics) {
        let num0to2weeks = 0;
        let num2to4weeks = 0;
        let num1to2months = 0;
        let num2to4months = 0;
        let num4to10months = 0;
        let numMoreThan10months = 0;

        const matches = await prisma.match.findMany({ where: { AND: [{ createdAt: { gte: statistics.from } }, { createdAt: { lt: statistics.to } }] } });
        matches.forEach((match) => {
            const duration = match.dissolved ? match.dissolvedAt.getTime() - match.createdAt.getTime() : new Date().getTime() - match.createdAt.getTime();
            if (duration < 2 * 7 * 24 * 60 * 60 * 1000) {
                num0to2weeks++;
            } else if (duration < 4 * 7 * 24 * 60 * 60 * 1000) {
                num2to4weeks++;
            } else if (duration < 2 * 30 * 24 * 60 * 60 * 1000) {
                num1to2months++;
            } else if (duration < 4 * 30 * 24 * 60 * 60 * 1000) {
                num2to4months++;
            } else if (duration < 10 * 30 * 24 * 60 * 60 * 1000) {
                num4to10months++;
            } else {
                numMoreThan10months++;
            }
        });
        return [
            {
                label: '0-2 Wochen',
                value: num0to2weeks,
            },
            {
                label: '2-4 Wochen',
                value: num2to4weeks,
            },
            {
                label: '1-2 Monate',
                value: num1to2months,
            },
            {
                label: '2-4 Monate',
                value: num2to4months,
            },
            {
                label: '4-10 Monate',
                value: num4to10months,
            },
            {
                label: '10+ Monate',
                value: numMoreThan10months,
            },
        ];
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async notificationsSent(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                      AS value,
                                             date_part('year', "sentAt"::date)  AS year,
                                             date_part('month', "sentAt"::date) AS month,
                                             "state"                            AS group
                                      FROM "concrete_notification"
                                      WHERE "sentAt" > ${statistics.from}::timestamp
                                        AND "sentAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "state"
                                      ORDER BY "year" ASC, "month" ASC, "state" ASC;`;
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.ADMIN)
    async loginsToday() {
        const beginingOfTheDay = new Date();
        beginingOfTheDay.setHours(0);
        beginingOfTheDay.setMinutes(0);

        return await prisma.secret.count({ where: { lastUsed: { gte: beginingOfTheDay } } });
    }
}
