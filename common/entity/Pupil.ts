import { Column, Entity, EntityManager, Index, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { Match } from "./Match";
import { Person } from "./Person";
import { Subcourse } from './Subcourse';
import { CourseTag } from './CourseTag';

@Entity()
export class Pupil extends Person {
    @Column()
    @Index({
        unique: true
    })
    wix_id: string;

    @Column()
    wix_creation_date: Date;

    @Column({
        default: true
    })
    isPupil: boolean;

    @Column({
        default: false
    })
    isParticipant: boolean;

    @Column()
    subjects: string;

    @ManyToMany(type => CourseTag, tag => tag.pupils)
    @JoinTable()
    tags: Promise<CourseTag[]>

    @Column({
        nullable: true
    })
    state: string;

    @Column({
        nullable: true
    })
    msg: string;

    @Column({
        nullable: true
    })
    grade: string;

    @ManyToMany(type => Subcourse, subcourse => subcourse.participants)
    subcourses: Promise<Subcourse[]>;

    @OneToMany((type) => Match, (match) => match.pupil, { nullable: true })
    matches: Promise<Match[]>;

    @Column({
        nullable: false,
        default: 1
    })
    openMatchRequestCount: number;

    @Column({
        nullable: false,
        default: 0 //everyone is default 0, i.e no priority
    })
    matchingPriority: number;

    @Column({
        nullable: false,
        default: false
    })
    newsletter: boolean;
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
