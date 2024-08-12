import { prisma } from '../prisma';
import { school as School } from '@prisma/client';

export interface CreateSchoolArgs {
    name?: School['name'];
    zip?: School['zip'];
    city?: School['city'];
    email?: School['email'];
    state?: School['state'];
    schooltype?: School['schooltype'];
}

export const findOrCreateSchool = async (school: CreateSchoolArgs) => {
    if (!school?.name) {
        return;
    }

    const existingSchool = await prisma.school.findFirst({
        where: {
            name: school.name,
            state: school.state,
            city: school.city || null,
        },
    });
    if (existingSchool) {
        return existingSchool;
    }

    const newSchool = await prisma.school.create({
        data: { name: school.name!, city: school.city, zip: school.zip, state: school.state, email: school.email, schooltype: school.schooltype },
    });
    return newSchool;
};
