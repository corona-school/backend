import {student as Student} from "@prisma/client";
import {prisma} from "../prisma";
import {dissolveMatch, dissolveProjectMatch} from "../match/dissolve";
import {getTransactionLog} from "../transactionlog";
import DeActivateEvent from "../transactionlog/types/DeActivateEvent";
import {CourseState} from "../entity/Course";


export async function deactivateStudent(student: Student) {
    if (!student.active) {
        throw new Error("Student was already deactivated");
    }
    // Dissolve matches for the student.
    let matches = await prisma.match.findMany({
        where: {
            studentId: student.id,
            dissolved: false
        }
    });

    for (const match of matches) {
        await dissolveMatch(match, 0, student);
    }

    let projectMatches = await prisma.project_match.findMany({
        where: {
            studentId: student.id,
            dissolved: false
        }
    });

    for (const match of projectMatches) {
        await dissolveProjectMatch(match, 0, student);
    }

    //Delete course records for the student.
    let studentCourses = await prisma.course_instructors_student.groupBy({
        by: ['courseId'],
        where: {
            studentId: student.id
        }
    });

    for (const course of studentCourses) {
        await prisma.course_instructors_student.deleteMany({
            where: {
                studentId: student.id,
                courseId: course.courseId
            }
        });
        if (studentCourses.length === 1) {
            await prisma.course.updateMany({
                where: {
                    id: course.courseId
                },
                data: {
                    courseState: CourseState.CANCELLED
                }
            });

            await prisma.subcourse.updateMany({
                where: {
                    courseId: course.courseId
                },
                data: {
                    cancelled: true
                }
            });

        }
    }





    await prisma.student.update({
        data: { active: false },
        where: { id: student.id }
    });

    await getTransactionLog().log(new DeActivateEvent(student, false));
}