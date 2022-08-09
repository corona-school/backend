import { Role } from "../authorizations";
import { Arg, Authorized, Field, FieldResolver, ObjectType, Query, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";

@ObjectType()
class ByMonth {
    @Field()
    year: number;
    @Field()
    month: number;
    @Field()
    value: number;

    @Field({ nullable: true })
    group?: string;
}


@ObjectType()
class Statistics {
    @Field({ nullable: true })
    from: string; // ISO Date String
    @Field({ nullable: true })
    to: string; // ISO Date String
}

@Resolver(of => Statistics)
export class StatisticsResolver {
    @Query(returns => Statistics)
    @Authorized(Role.ADMIN)
    statistics(@Arg("from", { nullable: true }) from: string = '1970-01-01', @Arg("to", { nullable: true }) to: string = '3000-01-01'): Statistics {
        return { from, to };
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async tutorRegistrations(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT
                    COUNT(*) AS value,
                    date_part('year', "createdAt"::date) AS year,
                    date_part('month', "createdAt"::date) AS month
                 FROM "student"
                 WHERE "isStudent" = TRUE AND "createdAt" > ${statistics.from} AND "createdAt" < ${statistics.to}
                 GROUP BY "year", "month"
                 ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async tutorRegistrationsByState(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT
            COUNT(*) AS value,
            date_part('year', "createdAt"::date) AS year,
            date_part('month', "createdAt"::date) AS month,
            "state" AS group
        FROM "student"
        WHERE "isStudent" = TRUE AND "createdAt" > ${statistics.from} AND "createdAt" < ${statistics.to}
        GROUP BY "year", "month", "state"
        ORDER BY "year" ASC, "month" ASC, "state" ASC;`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async tuteeRegistrations(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT
                COUNT(*) AS value,
                date_part('year', "createdAt"::date) AS year,
                date_part('month', "createdAt"::date) AS month
            FROM "pupil"
            WHERE "isPupil" = TRUE AND "createdAt" > ${statistics.from} AND "createdAt" < ${statistics.to}
            GROUP BY "year", "month"
            ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async tuteeRegistrationsByState(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT
                COUNT(*) AS value,
                date_part('year', "createdAt"::date) AS year,
                date_part('month', "createdAt"::date) AS month,
                "state" as group
            FROM "pupil"
            WHERE "isPupil" = TRUE AND "createdAt" > ${statistics.from} AND "createdAt" < ${statistics.to}
            GROUP BY "year", "month", "state"
            ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async tuteeRegistrationsBySchooltype(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT
            COUNT(*) AS value,
            date_part('year', "createdAt"::date) AS year,
            date_part('month', "createdAt"::date) AS month,
            "schooltype" as group
        FROM "pupil"
        WHERE "isPupil" = TRUE AND "createdAt" > ${statistics.from} AND "createdAt" < ${statistics.to}
        GROUP BY "year", "month", "schooltype"
        ORDER BY "year" ASC, "month" ASC, "schooltype" ASC;`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async tuteeRegistrationsByGrade(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT
                COUNT(*) AS value,
                date_part('year', "createdAt"::date) AS year,
                date_part('month', "createdAt"::date) AS month,
                "grade" as group
            FROM "pupil"
                WHERE "isPupil" = TRUE AND "createdAt" > ${statistics.from} AND "createdAt" < ${statistics.to}
                GROUP BY "year", "month", "grade"
                ORDER BY "year" ASC, "month" ASC, "grade" ASC;`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async tutorScreenings(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT
                    COUNT(*) AS value,
                    date_part('year', "createdAt"::date) AS year,
                    date_part('month', "createdAt"::date) AS month
                 FROM "screening"
                 WHERE "createdAt" > ${statistics.from} AND "createdAt" < ${statistics.to}
                 GROUP BY "year", "month"
                 ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowMatches(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT
                    COUNT(*) AS value,
                    date_part('year', "createdAt"::date) AS year,
                    date_part('month', "createdAt"::date) AS month
                 FROM "match"
                 WHERE "createdAt" > ${statistics.from} AND "createdAt" < ${statistics.to}
                GROUP BY "year", "month"
                ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowFirstMatches(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT
                    COUNT(*) AS value,
                    date_part('year', "createdAt"::date) AS year,
                    date_part('month', "createdAt"::date) AS month
                 FROM "match"
                 WHERE "pupilId" IN ( SELECT "pupilId" FROM "match" GROUP BY "pupilId" HAVING COUNT(*) = 1 ) AND
                   "createdAt" > ${statistics.from} AND "createdAt" < ${statistics.to}
                 GROUP BY "year", "month"
                 ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowDissolvedMatchesBeforeThreeMonths(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT
                    COUNT(*) AS value,
                    date_part('year', "updatedAt"::date) AS year,
                    date_part('month', "updatedAt"::date) AS month
                 FROM "match"
                 WHERE dissolved = TRUE AND date_part('day', "updatedAt"::timestamp - "createdAt"::timestamp) <= 90 AND
                   "updatedAt" > ${statistics.from} AND "updatedAt" < ${statistics.to}
                 GROUP BY "year", "month"
                 ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowDissolvedMatchesAfterThreeMonths(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT
                    COUNT(*) AS value,
                    date_part('year', "updatedAt"::date) AS year,
                    date_part('month', "updatedAt"::date) AS month
                 FROM "match"
                 WHERE dissolved = TRUE AND date_part('day', "updatedAt"::timestamp - "createdAt"::timestamp) > 90 AND
                   "updatedAt" > ${statistics.from} AND "updatedAt" < ${statistics.to}
                 GROUP BY "year", "month"
                 ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async offeredLectures(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT
                    COUNT(*) AS value,
                    date_part('year', "start"::date) AS year,
                    date_part('month', "start"::date) AS month
                 FROM "lecture"
                 WHERE "createdAt" > ${statistics.from} AND "createdAt" < ${statistics.to}
                 GROUP BY "year", "month"
                 ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async offeredCoursePlaces(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT "year", "month", SUM("subcourse"."maxParticipants") FROM (
                SELECT DISTINCT ON("subcourseId")
                    "subcourseId", "start",
                    date_part('year', "start"::date) AS "year",
                    date_part('month', "start"::date) AS "month"
                    FROM "lecture"
                    WHERE "start" > ${statistics.from} AND "start" < ${statistics.to}
                    ORDER BY "subcourseId", "start"
                ) "first_lecture"
                INNER JOIN "subcourse" ON "subcourse"."id" = "subcourseId"
                GROUP BY "year", "month"
                ORDER BY "year", "month";`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async attendedCoursePlaces(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT "year", "month", SUM("participants") AS "value" FROM (
                SELECT "year", "month", "subcourse"."id" AS "subcourseId", COUNT(*) AS "participants" FROM (
                    SELECT DISTINCT ON("subcourseId")
                        "subcourseId", "start",
                        date_part('year', "start"::date) AS "year",
                        date_part('month', "start"::date) AS "month"
                        FROM "lecture"
                        WHERE "start" > ${statistics.from} AND "start" < ${statistics.to}
                        ORDER BY "subcourseId", "start"
                    ) "first_lecture"
                    INNER JOIN "subcourse" ON "subcourse"."id" = "subcourseId"
                    INNER JOIN "subcourse_participants_pupil" ON "subcourse_participants_pupil"."subcourseId" = "subcourse"."id"
                    GROUP BY "year", "month", "subcourse"."id"
                ) "subcourse_participants"
                GROUP BY "year", "month"
                ORDER BY "year", "month";`;
    }

    @FieldResolver(returns => [ByMonth])
    @Authorized(Role.ADMIN)
    async pupilsParticipatingInCourses(@Root() statistics: Statistics) {
        return await prisma.$queryRaw
        `SELECT "year", "month", COUNT(DISTINCT "pupilId") AS "value" FROM (
                SELECT "year", "month", "subcourse_participants_pupil"."pupilId" FROM (
                  SELECT DISTINCT ON("subcourseId")
                      "subcourseId", "start",
                      date_part('year', "start"::date) AS "year",
                      date_part('month', "start"::date) AS "month"
                      FROM "lecture"
                      WHERE "start" > ${statistics.from} AND "start" < ${statistics.to}
                      ORDER BY "subcourseId", "start"
                  ) "first_lecture"
                  INNER JOIN "subcourse" ON "subcourse"."id" = "subcourseId"
                  INNER JOIN "subcourse_participants_pupil" ON "subcourse_participants_pupil"."subcourseId" = "subcourse"."id"
                  GROUP BY "year", "month", "subcourse_participants_pupil"."pupilId"
                ) "subcourse_participants"
                GROUP BY "year", "month"
                ORDER BY "year", "month";`;
    }
}