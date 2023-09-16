/* eslint-disable import/no-cycle */
import { Entity, Column, OneToMany, EntityManager } from 'typeorm';
import { Screening } from './Screening';
import { Person } from './Person';
import { prisma } from '../prisma';
import { init } from '../util/basic';

@Entity()
export class Screener extends Person {
    @Column()
    password: string;

    @Column({
        default: false,
        nullable: true,
    })
    verified: boolean;

    @Column({
        nullable: true,
        unique: true,
    })
    oldNumberID: number; //the number that screener had in the old database

    @OneToMany((type) => Screening, (screening) => screening.screener, {
        nullable: true,
    })
    screenings: Promise<Screening[]>;
}

const DEFAULT_SCREENER_FIRSTNAME = 'DEFAULT_SCREENER';
export const DEFAULT_SCREENER_NUMBER_ID = -1;

export const defaultScreener = init(async function getDefaultScreenerEntry() {
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
            verification: null,
            verifiedAt: new Date(),
        },
    });
});
