import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ScreeningInfo } from '../util/screening';
import { Screener } from './Screener';
import { Student } from './Student';

@Entity()
export class ProjectCoachingScreening {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    success: boolean; //verified or not verified

    @Column({
        nullable: true,
    })
    comment: string;

    @Column({
        nullable: true,
    })
    knowsCoronaSchoolFrom: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne((type) => Screener, (screener) => screener.screenings, {
        eager: true,
    })
    @JoinColumn()
    screener: Screener;

    @OneToOne((type) => Student, (student) => student.projectCoachingScreening, {
        eager: true,
    })
    @JoinColumn()
    student: Student;

    async updateScreeningInfo(screeningInfo: ScreeningInfo, screener?: Screener) {
        this.success = screeningInfo.verified ?? this.success;
        this.comment = screeningInfo.comment ?? this.comment;
        this.knowsCoronaSchoolFrom = screeningInfo.knowsCoronaSchoolFrom ?? this.knowsCoronaSchoolFrom;
        this.screener = screener ?? this.screener;
    }
}
