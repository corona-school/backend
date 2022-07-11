import { Role } from "../authorizations";
import { Authorized, Field, ObjectType, Query, Resolver } from "type-graphql";
import { prisma } from "../../common/prisma";

@ObjectType()
class ByMonth {
    @Field()
    year: number;
    @Field()
    month: number;
    @Field()
    value: number;
}

@ObjectType()
class Statistics {
    @Field(type => [ByMonth])
    tutorRegistrations: ByMonth[];
    @Field(type => [ByMonth])
    tutorScreenings: ByMonth[];

    @Field(type => [ByMonth])
    nowMatches: ByMonth[];
    @Field(type => [ByMonth])
    nowFirstMatches: ByMonth[];
    @Field(type => [ByMonth])
    nowDissolvedMatchesBeforeThreeMonths: ByMonth[];
    @Field(type => [ByMonth])
    nowDissolvedMatchesAfterThreeMonths: ByMonth[];

    @Field(type => [ByMonth])
    offeredLectures: ByMonth[];
    @Field(type => [ByMonth])
    offeredCoursePlaces: ByMonth[];
    @Field(type => [ByMonth])
    attendedCoursePlaces: ByMonth[];

    @Field(type => [ByMonth])
    pupilsParticipatingInCourses: ByMonth[];
}

@Resolver(of => Statistics)
export class StatisticsResolver {
    @Query(returns => Statistics)
    @Authorized(Role.ADMIN)
    async statistics(): Promise<Statistics> {
        return {
            tutorRegistrations: await prisma.$queryRaw
            `SELECT
                    COUNT(*) AS value,
                    date_part('year', "createdAt"::date) AS year,
                    date_part('month', "createdAt"::date) AS month
                 FROM "student"
                 WHERE "isStudent" = TRUE
                 GROUP BY "year", "month"
                 ORDER BY "year" ASC, "month" ASC;`
            ,
            tutorScreenings: await prisma.$queryRaw
            `SELECT
                    COUNT(*) AS value,
                    date_part('year', "createdAt"::date) AS year,
                    date_part('month', "createdAt"::date) AS month
                 FROM "screening"
                 GROUP BY "year", "month"
                 ORDER BY "year" ASC, "month" ASC;`
            ,

            nowMatches: await prisma.$queryRaw
            `SELECT
                    COUNT(*) AS value,
                    date_part('year', "createdAt"::date) AS year,
                    date_part('month', "createdAt"::date) AS month
                 FROM "match"
                GROUP BY "year", "month"
                ORDER BY "year" ASC, "month" ASC;`
            ,
            nowFirstMatches: await prisma.$queryRaw
            `SELECT
                    COUNT(*) AS value,
                    date_part('year', "createdAt"::date) AS year,
                    date_part('month', "createdAt"::date) AS month
                 FROM "match"
                 WHERE "pupilId" IN ( SELECT "pupilId" FROM "match" GROUP BY "pupilId" HAVING COUNT(*) = 1 )
                 GROUP BY "year", "month"
                 ORDER BY "year" ASC, "month" ASC;`
            ,
            nowDissolvedMatchesBeforeThreeMonths: await prisma.$queryRaw
            `SELECT
                    COUNT(*) AS value,
                    date_part('year', "updatedAt"::date) AS year,
                    date_part('month', "updatedAt"::date) AS month
                 FROM "match"
                 WHERE dissolved = TRUE AND date_part('day', "updatedAt"::timestamp - "createdAt"::timestamp) <= 90
                 GROUP BY "year", "month"
                 ORDER BY "year" ASC, "month" ASC;`
            ,
            nowDissolvedMatchesAfterThreeMonths: await prisma.$queryRaw
            `SELECT
                    COUNT(*) AS value,
                    date_part('year', "updatedAt"::date) AS year,
                    date_part('month', "updatedAt"::date) AS month
                 FROM "match"
                 WHERE dissolved = TRUE AND date_part('day', "updatedAt"::timestamp - "createdAt"::timestamp) > 90
                 GROUP BY "year", "month"
                 ORDER BY "year" ASC, "month" ASC;`
            ,

            offeredLectures: await prisma.$queryRaw
            `SELECT
                    COUNT(*) AS value,
                    date_part('year', "start"::date) AS year,
                    date_part('month', "start"::date) AS month
                 FROM "lecture"
                 GROUP BY "year", "month"
                 ORDER BY "year" ASC, "month" ASC;`
            ,
            offeredCoursePlaces: await prisma.$queryRaw
            `SELECT "year", "month", SUM("subcourse"."maxParticipants") FROM (
                SELECT DISTINCT ON("start")
                    "subcourseId", "start",
                    date_part('year', "start"::date) AS "year",
                    date_part('month', "start"::date) AS "month"
                    FROM "lecture"
                    ORDER BY "start"
                ) "first_lecture"
                INNER JOIN "subcourse" ON "subcourse"."id" = "subcourseId"
                GROUP BY "year", "month";`,
            attendedCoursePlaces: await prisma.$queryRaw
            `SELECT "year", "month", SUM("participants") AS "value" FROM (
                SELECT "year", "month", "subcourse"."id" AS "subcourseId", COUNT(*) AS "participants" FROM (
                  SELECT DISTINCT ON("start")
                      "subcourseId", "start",
                      date_part('year', "start"::date) AS "year",
                      date_part('month', "start"::date) AS "month"
                      FROM "lecture"
                      ORDER BY "start"
                  ) "first_lecture"
                  INNER JOIN "subcourse" ON "subcourse"."id" = "subcourseId"
                  INNER JOIN "subcourse_participants_pupil" ON "subcourse_participants_pupil"."subcourseId" = "subcourse"."id"
                  GROUP BY "year", "month", "subcourse"."id"
                ) "subcourse_participants"
                GROUP BY "year", "month";`,
            pupilsParticipatingInCourses: await prisma.$queryRaw
            `SELECT "year", "month", COUNT(DISTINCT "pupilId") AS "value" FROM (
                SELECT "year", "month", "subcourse_participants_pupil"."pupilId" FROM (
                  SELECT DISTINCT ON("start")
                      "subcourseId", "start",
                      date_part('year', "start"::date) AS "year",
                      date_part('month', "start"::date) AS "month"
                      FROM "lecture"
                      ORDER BY "start"
                  ) "first_lecture"
                  INNER JOIN "subcourse" ON "subcourse"."id" = "subcourseId"
                  INNER JOIN "subcourse_participants_pupil" ON "subcourse_participants_pupil"."subcourseId" = "subcourse"."id"
                  GROUP BY "year", "month", "subcourse_participants_pupil"."pupilId"
                ) "subcourse_participants"
                GROUP BY "year", "month";`
        };
    }
}