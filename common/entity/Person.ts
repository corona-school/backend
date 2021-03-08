import { Column, CreateDateColumn, EntityManager, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Pupil } from "./Pupil";
import { Student } from "./Student";

export abstract class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @Column({
        nullable: true
    })
    firstname: string;

    @Column({
        nullable: true
    })
    lastname: string;

    @Column({
        default: true
    })
    active: boolean;

    @Index({ unique: true })
    @Column()
    email: string;

    @Index({ unique: true })
    @Column({
        nullable: true,
        default: null
    })
    verification: string;

    @Column({
        type: "timestamp",
        default: null,
        nullable: true
    })
    verifiedAt: Date;

    @Index({ unique: true })
    @Column({
        nullable: true,
        default: null
    })
    authToken: string;

    @Column({
        nullable: false,
        default: false
    })
    authTokenUsed: boolean;

    @Column({
        nullable: true,
        default: null
    })
    authTokenSent: Date;

    fullName(): string {
        const names = [[this.firstname], [this.lastname]].flatMap(n => n[0]?.length > 0 ? n : []);
        return names.join(" ");
    }
}

export enum RegistrationSource {
    NORMAL,
    COOPERATION,
    DREHTUER,
    OTHER
}

export async function getPerson(emailAddr: string, manager: EntityManager, type: new () => Pupil | Student) {
    return await manager.findOne(type, {
        where: {
            active: true, //they need to be active
            email: emailAddr.toLowerCase()
        }
    });
}
export async function personExists(emailAddr: string, manager: EntityManager) {
    return await getPerson(emailAddr, manager, Pupil) != null || await getPerson(emailAddr, manager, Student) != null;
}