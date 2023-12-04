import assert from 'assert';
import { test } from './base';
import { prisma } from '../common/prisma';
import { createNewPupil, createNewStudent } from './01_user';
import moment from 'moment';
import redactInactiveAccounts, { GRACE_PERIOD } from '../jobs/periodic/redact-inactive-accounts';
import { pupil, student } from '@prisma/client';
import { adminClient } from './base/clients';

function testUser(shouldBeRedacted: boolean, userOld: pupil | student, userNew: pupil | student) {
    // TODO: check how to check if other things have been deleted
    if (shouldBeRedacted) {
        assert.strictEqual(userNew.isRedacted, true);
        assert.notStrictEqual(userOld.firstname, userNew.firstname);
        assert.notStrictEqual(userOld.lastname, userNew.lastname);
        assert.notStrictEqual(userOld.email, userNew.email);
    } else {
        assert.strictEqual(userNew.isRedacted, false);
        assert.strictEqual(userOld.firstname, userNew.firstname);
        assert.strictEqual(userOld.lastname, userNew.lastname);
        assert.strictEqual(userOld.email, userNew.email);
    }
}

// ------------------------------
// Pupil
// ------------------------------
void test('Should redact pupil that is inactive since three years', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const pupil = await createNewPupil();
    await prisma.pupil.update({
        where: { id: pupil.pupil.pupil.id },
        data: {
            lastLogin: moment().subtract(GRACE_PERIOD, 'days').subtract(1, 'day').toDate(),
            active: false,
        },
    });

    const dbPupilOld = await prisma.pupil.findUnique({ where: { id: pupil.pupil.pupil.id } });

    await redactInactiveAccounts();

    const dbPupilNew = await prisma.pupil.findUnique({ where: { id: pupil.pupil.pupil.id } });

    testUser(true, dbPupilOld, dbPupilNew);
});

void test('Should not redact pupil that is inactive since almost three years', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const pupil = await createNewPupil();
    await prisma.pupil.update({
        where: { id: pupil.pupil.pupil.id },
        data: {
            lastLogin: moment().subtract(GRACE_PERIOD, 'days').add(1, 'day').toDate(),
            active: false,
        },
    });

    const dbPupilOld = await prisma.pupil.findUnique({ where: { id: pupil.pupil.pupil.id } });

    await redactInactiveAccounts();

    const dbPupilNew = await prisma.pupil.findUnique({ where: { id: pupil.pupil.pupil.id } });

    testUser(false, dbPupilOld, dbPupilNew);
});

void test('Should not redact pupil that is inactive since three years, but account is active', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const pupil = await createNewPupil();
    await prisma.pupil.update({
        where: { id: pupil.pupil.pupil.id },
        data: {
            lastLogin: moment().subtract(GRACE_PERIOD, 'days').subtract(1, 'day').toDate(),
            active: true,
        },
    });

    const dbPupilOld = await prisma.pupil.findUnique({ where: { id: pupil.pupil.pupil.id } });

    await redactInactiveAccounts();

    const dbPupilNew = await prisma.pupil.findUnique({ where: { id: pupil.pupil.pupil.id } });

    testUser(false, dbPupilOld, dbPupilNew);
});

void test('Should ignore pupil with lastLogin = NULL', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const pupil = await createNewPupil();
    await prisma.pupil.update({
        where: { id: pupil.pupil.pupil.id },
        data: {
            lastLogin: null,
            active: false,
        },
    });

    const dbPupilOld = await prisma.pupil.findUnique({ where: { id: pupil.pupil.pupil.id } });

    await redactInactiveAccounts();

    const dbPupilNew = await prisma.pupil.findUnique({ where: { id: pupil.pupil.pupil.id } });

    testUser(false, dbPupilOld, dbPupilNew);
});

// ------------------------------
// Student
// ------------------------------
void test('Should redact student that is inactive since three years', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const student = await createNewStudent();
    await prisma.student.update({
        where: { id: student.student.student.id },
        data: {
            lastLogin: moment().subtract(GRACE_PERIOD, 'days').subtract(1, 'day').toDate(),
            active: false,
        },
    });

    const dbStudentOld = await prisma.student.findUnique({ where: { id: student.student.student.id } });

    await redactInactiveAccounts();

    const dbStudentNew = await prisma.student.findUnique({ where: { id: student.student.student.id } });

    testUser(true, dbStudentOld, dbStudentNew);
});

void test('Should not redact student that is inactive since almost three years', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const student = await createNewStudent();
    await prisma.student.update({
        where: { id: student.student.student.id },
        data: {
            lastLogin: moment().subtract(GRACE_PERIOD, 'days').add(1, 'day').toDate(),
            active: false,
        },
    });

    const dbStudentOld = await prisma.student.findUnique({ where: { id: student.student.student.id } });

    await redactInactiveAccounts();

    const dbStudentNew = await prisma.student.findUnique({ where: { id: student.student.student.id } });

    testUser(false, dbStudentOld, dbStudentNew);
});

void test('Should not redact student that is inactive since three years, but account is active', async () => {
    await adminClient.request(`mutation ResetRateLimits { _resetRateLimits }`);
    const student = await createNewStudent();
    await prisma.student.update({
        where: { id: student.student.student.id },
        data: {
            lastLogin: moment().subtract(GRACE_PERIOD, 'days').subtract(1, 'day').toDate(),
            active: true,
        },
    });

    const dbStudentOld = await prisma.student.findUnique({ where: { id: student.student.student.id } });

    await redactInactiveAccounts();

    const dbStudentNew = await prisma.student.findUnique({ where: { id: student.student.student.id } });

    testUser(false, dbStudentOld, dbStudentNew);
});
