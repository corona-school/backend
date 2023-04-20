import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Pupil } from './Pupil';
import { Subcourse } from './Subcourse';

@Entity()
export class WaitingListEnrollment {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ManyToOne(() => Pupil, (pupil) => pupil.waitingListEnrollments)
    pupil: Pupil;

    @ManyToOne(() => Subcourse, (subcourse) => subcourse.waitingListEnrollments)
    subcourse: Subcourse;
}
