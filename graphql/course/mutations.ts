import { course_category_enum } from '@prisma/client';
import { UserInputError } from 'apollo-server-express';
import { getFile, removeFile } from '../files';
import { getLogger } from '../../common/logger/logger';
import * as TypeGraphQL from 'type-graphql';
import { Arg, Authorized, Ctx, InputType, Mutation, Resolver } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { getSessionStudent } from '../authentication';
import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { GraphQLContext } from '../context';
import * as GraphQLModel from '../generated/models';
import { getCourse, getStudent, getSubcoursesForCourse } from '../util';
import { putFile, DEFAULT_BUCKET } from '../../common/file-bucket';
import * as Notification from '../../common/notification';

import { course_schooltype_enum as CourseSchooltype, course_subject_enum as CourseSubject } from '../generated';
import { ForbiddenError } from '../error';
import { addCourseInstructor, allowCourse, denyCourse, subcourseOver, deleteCourse, deleteSubcourse } from '../../common/courses/states';
import { getCourseImageKey } from '../../common/courses/util';
import { createCourseTag } from '../../common/courses/tags';
import { userForStudent } from '../../common/user';
import { updateAchievementCTXByCourse } from '../../common/achievement/update';

@InputType()
class PublicCourseCreateInput {
    @TypeGraphQL.Field((_type) => String)
    name!: string;
    @TypeGraphQL.Field((_type) => String)
    outline!: string;
    @TypeGraphQL.Field((_type) => String)
    description!: string;
    @TypeGraphQL.Field((_type) => course_category_enum)
    category!: course_category_enum;
    @TypeGraphQL.Field((_type) => Boolean)
    allowContact?: boolean;

    @TypeGraphQL.Field((_type) => CourseSubject, { nullable: true })
    subject?: CourseSubject;
    @TypeGraphQL.Field((_type) => CourseSchooltype, { nullable: true })
    schooltype?: 'gymnasium' | 'realschule' | 'grundschule' | 'hauptschule' | 'f_rderschule' | 'other';
}

@InputType()
class PublicCourseEditInput {
    @TypeGraphQL.Field((_type) => String, { nullable: true })
    name?: string;
    @TypeGraphQL.Field((_type) => String, { nullable: true })
    outline?: string;
    @TypeGraphQL.Field((_type) => String, { nullable: true })
    description?: string;
    @TypeGraphQL.Field((_type) => course_category_enum, { nullable: true })
    category?: course_category_enum;
    @TypeGraphQL.Field((_type) => Boolean, { nullable: true })
    allowContact?: boolean | undefined;

    @TypeGraphQL.Field((_type) => CourseSubject, { nullable: true })
    subject?: CourseSubject;
    @TypeGraphQL.Field((_type) => CourseSchooltype, { nullable: true })
    schooltype?: 'gymnasium' | 'realschule' | 'grundschule' | 'hauptschule' | 'f_rderschule' | 'other';
}

@InputType()
class CourseTagCreateInput {
    @TypeGraphQL.Field()
    name: string;
    @TypeGraphQL.Field()
    category: string;
}

const logger = getLogger('MutateCourseResolver');

@Resolver((of) => GraphQLModel.Course)
export class MutateCourseResolver {
    @Mutation((returns) => GraphQLModel.Course)
    @Authorized(Role.ADMIN, Role.INSTRUCTOR, Role.COURSE_SCREENER)
    async courseCreate(
        @Ctx() context: GraphQLContext,
        @Arg('course') course: PublicCourseCreateInput,
        @Arg('studentId', { nullable: true }) studentId?: number
    ): Promise<GraphQLModel.Course> {
        const mayCreateHomeworkHelp = context.user.roles.includes(Role.ADMIN) || context.user.roles.includes(Role.COURSE_SCREENER);
        if (!mayCreateHomeworkHelp && course.category === 'homework_help') {
            throw new ForbiddenError('Only authorized users can create homework help courses');
        }
        const student = await getSessionStudent(context, studentId);
        const result = await prisma.course.create({ data: { ...course, courseState: 'created' } });
        await prisma.course_instructors_student.create({ data: { courseId: result.id, studentId: student.id } });
        logger.info(`Course (${result.id}) created by Student (${student.id})`);
        return result;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.OWNER, Role.COURSE_SCREENER)
    async courseDelete(@Ctx() context: GraphQLContext, @Arg('courseId') courseId: number): Promise<boolean> {
        const course = await getCourse(courseId);
        await hasAccess(context, 'Course', course);
        const result = await deleteCourse(course);
        return true;
    }

    @Mutation((returns) => GraphQLModel.Course)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER, Role.COURSE_SCREENER)
    async courseMarkShared(@Ctx() context: GraphQLContext, @Arg('courseId') courseId: number, @Arg('shared') shared: boolean): Promise<GraphQLModel.Course> {
        const course = await getCourse(courseId);
        await hasAccess(context, 'Course', course);

        const updatedCourse = await prisma.course.update({
            where: { id: course.id },
            data: { shared: shared },
        });
        logger.info(`Course(${course.id} was ${shared ? 'shared' : 'unshared'} by User(${context.user.userID})`);
        return updatedCourse;
    }

    @Mutation((returns) => GraphQLModel.Course)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER, Role.COURSE_SCREENER)
    async courseEdit(
        @Ctx() context: GraphQLContext,
        @Arg('courseId') courseId: number,
        @Arg('course') data: PublicCourseEditInput
    ): Promise<GraphQLModel.Course> {
        const course = await getCourse(courseId);
        await hasAccess(context, 'Course', course);
        const mayCreateHomeworkHelp = context.user.roles.includes(Role.ADMIN) || context.user.roles.includes(Role.COURSE_SCREENER);
        const isTryingToCreateHomeworkHelp = course.category !== data.category && data.category === course_category_enum.homework_help;
        if (!mayCreateHomeworkHelp && isTryingToCreateHomeworkHelp) {
            throw new ForbiddenError('Only authorized users can create homework help courses');
        }

        if (course.courseState === 'allowed') {
            let editableSubcourse = false;
            for (const subcourse of await getSubcoursesForCourse(courseId, true)) {
                if (!subcourse.published || !(await subcourseOver(subcourse))) {
                    editableSubcourse = true;
                }
            }

            if (!editableSubcourse) {
                throw new ForbiddenError('Cannot edit course that has no unpublished or ongoing subcourse');
            }
        }
        const result = await prisma.course.update({ data, where: { id: courseId } });
        logger.info(`Course (${result.id}) updated by Student (${context.user.studentId})`);

        await updateAchievementCTXByCourse(result);

        return result;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER, Role.COURSE_SCREENER)
    async courseSetTags(@Ctx() context: GraphQLContext, @Arg('courseId') courseId: number, @Arg('courseTagIds', (_type) => [Number]) courseTagIds: number[]) {
        const course = await getCourse(courseId);
        await hasAccess(context, 'Course', course);

        const invalidTags = await prisma.course_tag.count({
            where: {
                id: { in: courseTagIds },
                category: { not: course.category },
            },
        });

        if (invalidTags) {
            throw new UserInputError(`Category of tags mismatches the category of the course`);
        }

        await prisma.course_tags_course_tag.deleteMany({
            where: { courseId: course.id },
        });

        await prisma.course_tags_course_tag.createMany({
            data: courseTagIds.map((it) => ({ courseId: course.id, courseTagId: it })),
        });

        logger.info(`User(${context.user.userID}) set tags of Course(${course.id}) to (${courseTagIds})`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER, Role.COURSE_SCREENER)
    async courseSetImage(@Ctx() context: GraphQLContext, @Arg('courseId') courseId: number, @Arg('fileId') fileId: string) {
        const course = await getCourse(courseId);
        await hasAccess(context, 'Course', course);

        const file = getFile(fileId);

        if (file.mimetype !== 'image/jpeg') {
            throw new UserInputError(`File must be image/jpeg, was '${file.mimetype}' instead`);
        }

        const imageKey = getCourseImageKey(course, file.mimetype);
        await putFile(file.buffer, imageKey, DEFAULT_BUCKET, true, file.mimetype);
        removeFile(fileId);

        await prisma.course.update({
            data: { imageKey },
            where: { id: course.id },
        });

        logger.info(`User(${context.user.userID}) uploaded a new course image for Course(${course.id})`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER, Role.COURSE_SCREENER)
    async courseAddInstructor(@Ctx() context: GraphQLContext, @Arg('courseId') courseId: number, @Arg('studentId') studentId: number): Promise<boolean> {
        const course = await getCourse(courseId);
        await hasAccess(context, 'Course', course);

        const newInstructor = await getStudent(studentId);
        await addCourseInstructor(context.user, course, newInstructor);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER, Role.COURSE_SCREENER)
    async courseDeleteInstructor(@Ctx() context: GraphQLContext, @Arg('courseId') courseId: number, @Arg('studentId') studentId: number): Promise<boolean> {
        const course = await getCourse(courseId);
        await hasAccess(context, 'Course', course);
        await getStudent(studentId);

        await prisma.course_instructors_student.delete({ where: { courseId_studentId: { courseId, studentId } } });
        logger.info(`Student (${studentId}) was deleted from Course(${courseId}) by User(${context.user.userID})`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER, Role.COURSE_SCREENER)
    async courseSubmit(@Ctx() context: GraphQLContext, @Arg('courseId') courseId: number): Promise<boolean> {
        const course = await getCourse(courseId);
        await hasAccess(context, 'Course', course);
        await prisma.course.update({ data: { courseState: 'submitted' }, where: { id: courseId } });
        logger.info(`Course (${courseId}) submitted by Student (${context.user.studentId})`);

        const subcourses = await prisma.subcourse.findMany({
            where: { courseId: courseId },
            include: { subcourse_instructors_student: { select: { student: true } } },
        });
        for (const subcourse of subcourses) {
            if (!subcourse.subcourse_instructors_student) {
                continue;
            }
            for (const subcourseInstructor of subcourse.subcourse_instructors_student) {
                await Notification.actionTaken(userForStudent(subcourseInstructor.student), 'instructor_course_submitted', {
                    course: { name: course.name },
                    subcourse: { id: subcourse.id.toString() },
                    relation: `subcourse/${subcourse.id}`,
                });
            }
        }
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.COURSE_SCREENER)
    async courseAllow(@Arg('courseId') courseId: number, @Arg('screeningComment', { nullable: true }) screeningComment?: string | null): Promise<boolean> {
        await allowCourse(await getCourse(courseId), screeningComment);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.COURSE_SCREENER)
    async courseDeny(@Arg('courseId') courseId: number, @Arg('screeningComment', { nullable: true }) screeningComment?: string | null): Promise<boolean> {
        await denyCourse(await getCourse(courseId), screeningComment);
        return true;
    }

    @Mutation((returns) => GraphQLModel.Course_tag)
    @Authorized(Role.ADMIN, Role.COURSE_SCREENER)
    async courseTagCreate(@Ctx() context: GraphQLContext, @Arg('data') data: CourseTagCreateInput) {
        const { category, name } = data;
        const tag = await createCourseTag(context.user, name, category as course_category_enum);

        return tag;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.COURSE_SCREENER)
    async courseTagActivate(@Ctx() context: GraphQLContext, @Arg('courseTagId') courseTagId: number, @Arg('active') active: boolean) {
        const tag = await prisma.course_tag.findUnique({ where: { id: courseTagId } });
        if (!tag) {
            throw new UserInputError(`Unknown CourseTag(${courseTagId})`);
        }

        await prisma.course_tag.update({
            where: { id: courseTagId },
            data: { active },
        });

        logger.info(`User(${context.user.userID}) ${active ? 'activated' : 'deactivated'} CourseTag(${tag.id})`);
        return true;
    }

    @Mutation((returns) => GraphQLModel.Course_tag)
    @Authorized(Role.ADMIN, Role.COURSE_SCREENER)
    async courseTagDelete(@Ctx() context: GraphQLContext, @Arg('courseTagId') courseTagId: number) {
        const tag = await prisma.course_tag.findUnique({ where: { id: courseTagId } });
        if (!tag) {
            throw new UserInputError(`Unknown CourseTag(${courseTagId})`);
        }

        await prisma.course_tags_course_tag.deleteMany({
            where: { courseTagId: courseTagId },
        });

        await prisma.course_tag.delete({
            where: { id: courseTagId },
        });

        logger.info(`User(${context.user.userID}) removed CourseTag(${tag.id})`);
        return tag;
    }
}
