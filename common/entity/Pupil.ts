import { Column, Entity, EntityManager, Index, OneToMany } from "typeorm";
import { Match } from "./Match";
import { Person } from "./Person";

@Entity()
export class Pupil extends Person {
    @Column()
    @Index({
        unique: true,
    })
    wix_id: string;

    @Column()
    wix_creation_date: Date;

    @Column()
    subjects: string;

    @Column({
        nullable: true,
    })
    state: string;

    @Column({
        nullable: true,
    })
    msg: string;

    @Column({
        nullable: true,
    })
    grade: string;

    @OneToMany((type) => Match, (match) => match.pupil, { nullable: true })
    matches: Promise<Match[]>;

    @Column({
        nullable: false,
        default: 1,
    })
    openMatchRequestCount: number;

    @Column({
        nullable: false,
        default: 0, //everyone is default 0, i.e no priority
    })
    matchingPriority: number;
}

export function getPupilWithEmail(manager: EntityManager, email: string) {
    return manager.findOne(Pupil, { email: email });
}

export function getPupilByWixID(manager: EntityManager, wixID: string) {
    return manager.findOne(Pupil, { wix_id: wixID });
}

export async function activeMatchesOfPupil(p: Pupil, manager: EntityManager) {
    return (await p.matches).filter((m) => m.dissolved === false);
}

export async function activeMatchCountOfPupil(
    p: Pupil,
    manager: EntityManager
) {
    return (await activeMatchesOfPupil(p, manager)).length;
}
