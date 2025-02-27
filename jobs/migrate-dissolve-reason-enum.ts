import { getLogger } from '../common/logger/logger';
import { prisma } from '../common/prisma';

const logger = getLogger();

export default async function execute() {
    logger.info('Beginning migration to multiple dissolve reasons...');
    const values = await prisma.match.findMany({ where: { dissolveReasonEnum: { not: null } }, select: { id: true, dissolveReasonEnum: true } });

    for (const { id, dissolveReasonEnum } of values) {
        await prisma.match.update({ where: { id: id }, data: { dissolveReasons: [dissolveReasonEnum] } });
    }
    logger.info('Sucessfully migrated dissolve reason to array');
}
