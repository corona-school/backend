import { prisma } from '../prisma';
import { school as School, school_state_enum } from '@prisma/client';
import { getStateFromZip } from '../util/stateMappings';

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

    const state = (school.state === school_state_enum.other || !school.state) && school.zip ? getStateFromZip(Number(school.zip)) : school.state;

    const existingSchool = await prisma.school.findFirst({
        where: {
            name: school.name,
            state: state as school_state_enum,
            city: school.city || null,
        },
    });
    if (existingSchool) {
        return existingSchool;
    }

    const newSchool = await prisma.school.create({
        data: { name: school.name!, city: school.city, zip: school.zip, state: state as school_state_enum, email: school.email, schooltype: school.schooltype },
    });
    return newSchool;
};
