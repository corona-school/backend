import { pupil_schooltype_enum as SchoolType } from '@prisma/client';

export const SchoolTypeMap: Record<string, SchoolType> = {
    grundschule: 'grundschule',
    gesamtschule: 'gesamtschule',
    hauptschule: 'hauptschule',
    realschule: 'realschule',
    gymnasium: 'gymnasium',
    förderschule: 'f_rderschule',
    berufsschule: 'berufsschule',
    mittelschule: 'mittelschule',
    stadtteilschule: 'stadtteilschule',
    berufsfachschule: 'berufsfachschule',
    fachoberschule: 'fachoberschule',
    berufsoberschule: 'berufsoberschule',
    oberstufenzentrum: 'oberstufenzentrum',
    fachschule: 'fachschule',
    abendschule_vhs: 'abendschule_vhs',
    berufskolleg: 'berufskolleg',
    uni_studienkolleg: 'uni_studienkolleg',
    auslandsschule: 'auslandsschule',
    privatschule: 'privatschule',
    other: 'other',
};
