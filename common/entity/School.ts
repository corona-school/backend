import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { State } from './State';
import { Pupil } from "./Pupil";
import { SchoolType } from "./SchoolType";


@Entity()
export class School {
    /*
     * General metadata
     */
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    /*
     * School data
     */
    @Column({
        nullable: false
    })
    name: string;

    @Column({
        nullable: true
    })
    @Index({
        unique: true
    })
    website: string;

    @Column({
        nullable: false
    })
    @Index({
        unique: true
    })
    emailDomain: string;

    @Column({
        type: 'enum',
        enum: State,
        nullable: true,
        default: State.OTHER
    })
    state: State;

    @Column({
        type: 'enum',
        enum: SchoolType,
        default: SchoolType.SONSTIGES
    })
    schooltype: SchoolType;

    @Column({
        default: false,
        nullable: false
    })
    activeCooperation: boolean;

    /*
     *  Relationships
     */
    @OneToMany(type => Pupil, pupil => pupil.school, {
        nullable: false
    })
    pupils: Promise<Pupil[]>;
}