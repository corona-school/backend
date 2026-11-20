import { internship as Internship, internship_status_enum } from '@prisma/client';
import { prismaMock } from '../../jest/singletons';
import { getDefaultSemesterEnd, getLectureScope, internshipPeriodFilter } from './internship';

const STUDENT = { id: 7 };

// Dates are created in local time, so that the tests do not depend on the timezone they run in
const day = (year: number, month: number, date: number, hours = 0) => new Date(year, month - 1, date, hours);
const endOfDay = (year: number, month: number, date: number) => new Date(year, month - 1, date, 23, 59, 59, 999);

function internship(overrides: Partial<Internship> = {}): Internship {
    return {
        id: 1,
        createdAt: day(2026, 4, 1),
        updatedAt: day(2026, 4, 1),
        startDate: day(2026, 4, 15),
        endDate: day(2026, 9, 30),
        status: internship_status_enum.in_progress,
        studentId: STUDENT.id,
        ...overrides,
    };
}

describe('getDefaultSemesterEnd', () => {
    it.each([
        // Winter semester, started in the previous year
        ['beginning of January', day(2026, 1, 1), day(2026, 3, 31)],
        ['end of March', day(2026, 3, 31, 23), day(2026, 3, 31)],
        // Summer semester
        ['beginning of April', day(2026, 4, 1), day(2026, 9, 30)],
        ['middle of July', day(2026, 7, 15), day(2026, 9, 30)],
        ['end of September', day(2026, 9, 30, 23), day(2026, 9, 30)],
        // Winter semester, ends in the next year
        ['beginning of October', day(2026, 10, 1), day(2027, 3, 31)],
        ['end of December', day(2026, 12, 31, 23), day(2027, 3, 31)],
    ])('ends the semester for the %s correctly', (_name, date, expected) => {
        expect(getDefaultSemesterEnd(date)).toEqual(expected);
    });
});

describe('getLectureScope', () => {
    describe('with a specific internship', () => {
        it('restricts the lectures to the period of that internship', async () => {
            const completed = internship({ id: 3, status: internship_status_enum.completed });
            prismaMock.internship.findFirstOrThrow.mockResolvedValue(completed);

            const result = await getLectureScope(STUDENT, 3);

            expect(result).toEqual({ internship: completed, lectureScope: { start: { gte: day(2026, 4, 15), lte: endOfDay(2026, 9, 30) } } });
        });

        it('only accepts internships of the student that were not cancelled', async () => {
            prismaMock.internship.findFirstOrThrow.mockResolvedValue(internship({ id: 3 }));

            await getLectureScope(STUDENT, 3);

            expect(prismaMock.internship.findFirstOrThrow).toHaveBeenCalledWith({
                where: { id: 3, studentId: STUDENT.id, status: { not: internship_status_enum.cancelled } },
            });
            expect(prismaMock.internship.findFirst).not.toHaveBeenCalled();
        });

        it('fails if the internship cannot be found', async () => {
            prismaMock.internship.findFirstOrThrow.mockRejectedValue(new Error('No internship found'));

            await expect(getLectureScope(STUDENT, 3)).rejects.toThrow('No internship found');
            expect(prismaMock.internship.findMany).not.toHaveBeenCalled();
        });
    });

    describe('without a specific internship', () => {
        it('uses the earliest internship in progress', async () => {
            const inProgress = internship({ id: 2, endDate: null });
            prismaMock.internship.findFirst.mockResolvedValue(inProgress);

            const result = await getLectureScope(STUDENT);

            expect(prismaMock.internship.findFirst).toHaveBeenCalledWith({
                where: { studentId: STUDENT.id, status: internship_status_enum.in_progress },
                orderBy: { startDate: 'asc' },
            });
            expect(result).toEqual({ internship: inProgress, lectureScope: { start: { gte: day(2026, 4, 15) } } });
            expect(prismaMock.internship.findFirstOrThrow).not.toHaveBeenCalled();
            expect(prismaMock.internship.findMany).not.toHaveBeenCalled();
        });

        it('does not restrict the lectures if the student never had an internship', async () => {
            prismaMock.internship.findFirst.mockResolvedValue(null);
            prismaMock.internship.findMany.mockResolvedValue([]);

            const result = await getLectureScope(STUDENT);

            expect(result).toEqual({ internship: null, lectureScope: undefined });
        });

        it('excludes the periods of all other internships that were not cancelled', async () => {
            prismaMock.internship.findFirst.mockResolvedValue(null);
            prismaMock.internship.findMany.mockResolvedValue([
                internship({ id: 1, status: internship_status_enum.completed, startDate: day(2025, 10, 1), endDate: day(2026, 3, 31) }),
                internship({ id: 2, status: internship_status_enum.completed, startDate: day(2026, 4, 15), endDate: day(2026, 9, 30) }),
            ]);

            const result = await getLectureScope(STUDENT);

            expect(prismaMock.internship.findMany).toHaveBeenCalledWith({
                where: { studentId: STUDENT.id, status: { not: internship_status_enum.cancelled } },
            });
            expect(result).toEqual({
                internship: null,
                lectureScope: {
                    NOT: {
                        OR: [
                            { start: { gte: day(2025, 10, 1), lte: endOfDay(2026, 3, 31) } },
                            { start: { gte: day(2026, 4, 15), lte: endOfDay(2026, 9, 30) } },
                        ],
                    },
                },
            });
        });

        it('excludes everything after the start of a completed internship without an end date', async () => {
            prismaMock.internship.findFirst.mockResolvedValue(null);
            prismaMock.internship.findMany.mockResolvedValue([internship({ status: internship_status_enum.completed, endDate: null })]);

            const result = await getLectureScope(STUDENT);

            expect(result.lectureScope).toEqual({ NOT: { OR: [{ start: { gte: day(2026, 4, 15) } }] } });
        });
    });
});
