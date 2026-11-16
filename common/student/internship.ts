import moment from 'moment';
import { internship as Internship, internship_status_enum, Prisma, student as Student } from '@prisma/client';
import { prisma } from '../prisma';

export function getDefaultSemesterEnd(date: Date) {
    const d = moment(date);
    const month = d.month();

    if (month >= 9) {
        // WiSe: Oct 1 – Mar 31
        return moment([d.year() + 1, 2, 31]).toDate();
    }

    if (month <= 2) {
        // WiSe: Oct 1 – Mar 31
        return moment([d.year(), 2, 31]).toDate();
    }

    // SoSe: Apr 1 – Sep 30
    return moment([d.year(), 8, 30]).toDate();
}

// Lectures that start within the internship, the end date is inclusive. Internships without an end date are open ended
export const internshipPeriodFilter = ({ startDate, endDate }: Pick<Internship, 'startDate' | 'endDate'>): Prisma.lectureWhereInput => ({
    start: { gte: startDate, ...(endDate && { lte: moment(endDate).endOf('day').toDate() }) },
});

/**
 * Determines which lectures a certificate of the student covers:
 * When there is an internship present (the given one, or otherwise the earliest one in progress), we only consider lectures within its period.
 * In case of no internship given, we exclude lectures that fall within any of the student's other internships.
 */
export async function getLectureScope(requester: Pick<Student, 'id'>, internshipId?: number) {
    const internship = internshipId
        ? await prisma.internship.findFirstOrThrow({
              where: { id: internshipId, studentId: requester.id, status: { not: internship_status_enum.cancelled } },
          })
        : await prisma.internship.findFirst({
              where: { studentId: requester.id, status: internship_status_enum.in_progress },
              orderBy: { startDate: 'asc' },
          });

    if (internship) {
        return { internship, lectureScope: internshipPeriodFilter(internship) };
    }

    const otherInternships = await prisma.internship.findMany({
        where: { studentId: requester.id, status: { not: internship_status_enum.cancelled } },
    });
    const lectureScope: Prisma.lectureWhereInput | undefined = otherInternships.length
        ? { NOT: { OR: otherInternships.map(internshipPeriodFilter) } }
        : undefined;
    return { internship: null, lectureScope };
}
