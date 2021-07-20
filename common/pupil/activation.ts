import { pupil as Pupil } from "@prisma/client";
import { getTransactionLog } from "../transactionlog";
import { prisma } from "../prisma";
import DeActivateEvent from "../transactionlog/types/DeActivateEvent";
import { dissolveMatch } from "../match/dissolve";

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
        }
    });

    for (const match of matches) {
        await dissolveMatch(match, 0, pupil);
    }

    await prisma.pupil.update({
        data: { active: false },
        where: { id: pupil.id }
    });

    await getTransactionLog().log(new DeActivateEvent(pupil, false));
}