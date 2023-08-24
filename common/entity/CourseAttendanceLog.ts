/* eslint-disable import/no-cycle */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Pupil } from './Pupil';
import { Lecture } from './Lecture';
import { JoinColumn } from 'typeorm';

@Entity()
export class CourseAttendanceLog {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ nullable: true })
    attendedTime: number;

    @Column({ nullable: true })
    ip: string;

    @ManyToOne((type) => Pupil, (pupil) => pupil.courseAttendanceLog, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    pupil: Pupil;

    @ManyToOne((type) => Lecture, (lecture) => lecture.courseAttendanceLog, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn()
    lecture: Lecture;
}
