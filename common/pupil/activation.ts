import { pupil as Pupil } from "@prisma/client";
import { getTransactionLog } from "../transactionlog";
import { prisma } from "../prisma";
import DeActivateEvent from "../transactionlog/types/DeActivateEvent";

export async function activatePupil(pupil: Pupil) {
    await prisma.pupil.update({
        data: { active: true },
        where: { id: pupil.id }
    });

    await getTransactionLog().log(new DeActivateEvent(pupil, true));
}


export async function deactivatePupil(pupil: Pupil) {
    let matches = await prisma.match.findMany({
        where: {
            pupilId: pupil.id
        },
        include: { student: true, pupil: true }
    });

    for (const match of matches) {
        // TODO: Move dissolveMatch into common and generalize
        // await dissolveMatch(match, 0, pupil);
    }

    await prisma.pupil.update({
        data: { active: false },
        where: { id: pupil.id }
    });

    await getTransactionLog().log(new DeActivateEvent(pupil, false));
}