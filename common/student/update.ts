import { prisma } from '../prisma';
import {
    project_field_with_grade_restriction as ProjectFieldWithGrade,
    pupil_projectfields_enum as ProjectField,
    student_registrationsource_enum as RegistrationSource,
    student as Student,
    student_languages_enum as Language,
    student_state_enum as State,
    student_module_enum as TeacherModule,
} from '@prisma/client';
import { ProjectFieldWithGradeData } from './registration';

export async function setProjectFields(student: Student, projectFields: ProjectFieldWithGradeData[]) {
    // Atomically update the one-to-many entries in the relation (deleting removed ones)
    // Unfortunately this is not yet possible with a relation query (https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries)
    await prisma.$transaction(async (prisma) => {
        await prisma.project_field_with_grade_restriction.deleteMany({ where: { studentId: student.id } });
        await prisma.project_field_with_grade_restriction.createMany({ data: projectFields.map((it) => ({ ...it, studentId: student.id })) });
    });
}
