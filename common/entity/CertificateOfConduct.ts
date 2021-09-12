import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Student} from "./Student";
import {Screener} from "./Screener";

@Entity()
export class CertificateOfConduct {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @Column({
        nullable: false
    })
    dateOfInspection: Date;

    @Column({
        nullable: false
    })
    dateOfIssue: Date;

    @Column({
        nullable: false
    })
    criminalRecords:Boolean;

    @ManyToOne((type) => Screener, (inspectingScreener) => inspectingScreener.screenings, {
        eager: true
    })
    @JoinColumn()
    inspactingScreener: Screener;

    @OneToOne((type) => Student, (student) => student.cocScreening, {
        eager: true
    })
    @JoinColumn()
    student: Student;

}