import { match as Match } from '@prisma/client';
import { prisma } from '../prisma';
import { actionTakenAt } from './index';
import { NotificationContext, BulkAction, ActionID } from './types';
import { getMatchHash } from '../match/util';

interface BulkRun {
    name: string;
    count: number;
    progress: number;
    apply: boolean;
    notificationCount: { [id: number]: number };
    errors: string[];
    currentUser?: string;
    startedAt: string;
    finishedAt?: string;
}

export const bulkActions: BulkAction<any>[] = [];
export const bulkRuns: BulkRun[] = [];

export async function runBulkAction(name: string, apply: boolean) {
    const bulkAction = bulkActions.find((it) => it.name === name);
    if (!bulkAction) {
        throw new Error(`Bulk Action ${bulkAction} not found`);
    }

    const entities = await bulkAction.getData();

    const bulkRun: BulkRun = { name, count: entities.length, progress: 0, apply, notificationCount: {}, errors: [], startedAt: new Date().toISOString() };
    bulkRuns.push(bulkRun);

    void (async function fireAndForget() {
        for (const entity of entities) {
            try {
                const user = await bulkAction.getUser(entity);
                if (!user.active) {
                    bulkRun.progress += 1;
                    continue;
                }

                const actionDate = bulkAction.getActionDate(entity);
                const context = await bulkAction.getContext(entity);

                bulkRun.currentUser = user.userID;

                const result = await actionTakenAt(actionDate, user, bulkAction.action, context, apply);
                for (const { id } of result.directSends) {
                    if (!bulkRun.notificationCount[id]) {
                        bulkRun.notificationCount[id] = 0;
                    }

                    bulkRun.notificationCount[id] += 1;
                }

                for (const {
                    notification: { id },
                } of result.reminders) {
                    if (!bulkRun.notificationCount[id]) {
                        bulkRun.notificationCount[id] = 0;
                    }

                    bulkRun.notificationCount[id] += 1;
                }
            } catch (error) {
                bulkRun.errors.push(error.message);
            }

            bulkRun.progress += 1;
        }

        bulkRun.finishedAt = new Date().toISOString();
    })();
}

function addBulkAction<Entity>(action: BulkAction<Entity>) {
    bulkActions.push(action);
}

/* -------------------------------------- Actions ------------------------------------------------------------------- */

/* Run on 22.01.2022
const MATCH_SURVEYS_INTRODUCTION = new Date(1642286012775);

addBulkAction<{ id: number, pupilId: number, studentId: number, createdAt: Date, uuid: string }>({
    name: "match-student-surveys",
    action: "tutor_matching_success",
    getData: () => prisma.match.findMany({
        where: { dissolved: false, createdAt: { lte: MATCH_SURVEYS_INTRODUCTION } },
        select: { id: true, pupilId: true, studentId: true, createdAt: true, uuid: true }
    }),
    getActionDate: match => match.createdAt,
    getUser: match => userForStudent(prisma.student.findUnique({ where: { id: match.studentId }})),
    getContext: async match => ({
        uniqueId: "" + match.id,
        pupil: await prisma.pupil.findUnique({ where: { id: match.pupilId }}),
        firstMatch: (await prisma.match.count({ where: { studentId: match.studentId, createdAt: { lt: match.createdAt }}})) === 0,
        matchHash: getMatchHash(match),
        matchDate: "" + (+match.createdAt)
    })
});

addBulkAction<{ id: number, pupilId: number, studentId: number, createdAt: Date, uuid: string }>({
    name: "match-pupil-surveys",
    action: "tutee_matching_success",
    getData: () => prisma.match.findMany({
        where: { dissolved: false, createdAt: { lte: MATCH_SURVEYS_INTRODUCTION } },
        select: { id: true, pupilId: true, studentId: true, createdAt: true, uuid: true }
    }),
    getActionDate: match => match.createdAt,
    getUser: match => prisma.pupil.findUnique({ where: { id: match.pupilId }}),
    getContext: async match => ({
        uniqueId: "" + match.id,
        student: userForStudent(await prisma.student.findUnique({ where: { id: match.studentId }})),
        firstMatch: (await prisma.match.count({ where: { pupilId: match.pupilId, createdAt: { lt: match.createdAt }}})) === 0,
        matchHash: getMatchHash(match),
        matchDate: "" + (+match.createdAt)
    })
});
*/
