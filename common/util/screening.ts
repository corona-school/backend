import { prisma } from '../prisma';

const DEFAULT_SCREENER_FIRSTNAME = 'DEFAULT_SCREENER';
export const DEFAULT_SCREENER_NUMBER_ID = -1;

export const defaultScreener = (async function getDefaultScreenerEntry() {
    const existing = await prisma.screener.findUnique({ where: { oldNumberID: DEFAULT_SCREENER_NUMBER_ID } });
    if (existing) {
        return existing;
    }

    return await prisma.screener.create({
        data: {
            firstname: DEFAULT_SCREENER_FIRSTNAME,
            lastname: '',
            password: '',
            verified: true,
            id: DEFAULT_SCREENER_NUMBER_ID,
            oldNumberID: DEFAULT_SCREENER_NUMBER_ID,
            email: 'kontakt@lern-fair.de',
            active: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            verifiedAt: new Date(),
        },
    });
})();
