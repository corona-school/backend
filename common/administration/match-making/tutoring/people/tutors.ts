import { EntityManager, SelectQueryBuilder } from "typeorm";
import { ScreeningStatus, Student } from "../../../../entity/Student";
import { InvalidEmailDomains } from "../../invalid-email-domains";

///Returns true whether the tutor is allowed to get a match
export async function tutorIsAllowedToGetMatch(manager: EntityManager, tutor: Student) {
    //basic criteria every tutor that want's a match, must fulfill
    const isAllowedBasics = tutor.active && tutor.verification == null && tutor.isStudent && tutor.openMatchRequestCount > 0;

    //1-on-1 tutor criterion / screening
    const isAllowedBy1on1Tutoring = tutor.isStudent && await tutor.screeningStatus() === ScreeningStatus.Accepted;

    return isAllowedBasics && isAllowedBy1on1Tutoring;
}
export function tutorsToMatchQuery(manager: EntityManager): SelectQueryBuilder<Student> {
    return manager.createQueryBuilder()
        .select("s")
        .from(Student, "s")
        .leftJoin("s.screening", "screening")
        .where("s.active IS TRUE \
                AND s.verification IS NULL \
                AND s.isStudent IS TRUE \
                AND s.openMatchRequestCount > 0 \
                AND s.subjects <> '[]' \
                AND split_part(s.email, '@', 2) NOT IN (:...emailDomainExclusions) \
                AND (screening.success IS TRUE AND s.isStudent) \
                AND s.isCodu IS FALSE \
                AND s.registrationSource <> 5", { emailDomainExclusions: InvalidEmailDomains});
}

export async function getNumberOfTutorsToMatch(manager: EntityManager) {
    return await tutorsToMatchQuery(manager).getCount();
}
export async function tutorsToMatch(manager: EntityManager) {
    return await tutorsToMatchQuery(manager).getMany();
}