/* eslint-disable import/no-cycle */
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { Screener } from './Screener';

@Entity()
export class CertificateOfConduct {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({
        nullable: false,
    })
    dateOfInspection: Date;

    @Column({
        nullable: false,
    })
    dateOfIssue: Date;

    @Column({
        nullable: false,
    })
    criminalRecords: boolean;

    @OneToOne((type) => Student, (student) => student.certificateOfConduct, {
        eager: true,
    })
    @JoinColumn()
    student: Student;
}
