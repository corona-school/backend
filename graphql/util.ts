import { prisma } from "../common/prisma";


/* Helpers to get Entities by their primary key */
export const getPupil = (pupilId: number) => prisma.pupil.findUnique({ where: { id: pupilId }, rejectOnNotFound: true });
export const getSubcourse = (subcourseId: number) => prisma.subcourse.findUnique({ where: { id: subcourseId }, rejectOnNotFound: true });
export const getMatch = (matchId: number) => prisma.match.findUnique({ where: { id: matchId }, rejectOnNotFound: true });
export const getStudent = (studentId: number) => prisma.student.findUnique({ where: { id: studentId }, rejectOnNotFound: true });
export const getScreener = (screenerId: number) => prisma.screener.findUnique({ where: { id: screenerId }, rejectOnNotFound: true });
