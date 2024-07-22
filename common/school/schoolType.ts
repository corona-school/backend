import { pupil_schooltype_enum as SchoolType } from '@prisma/client';

export const SchoolTypeMap: Record<string, SchoolType> = {
    grundschule: 'grundschule',
    gesamtschule: 'gesamtschule',
    hauptschule: 'hauptschule',
    realschule: 'realschule',
    gymnasium: 'gymnasium',
    förderschule: 'f_rderschule',
    berufsschule: 'berufsschule',
    other: 'other',
};
