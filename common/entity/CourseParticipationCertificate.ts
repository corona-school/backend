import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { Pupil } from './Pupil';
import { Subcourse } from './Subcourse';

@Entity()
export class CourseParticipationCertificate {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne((type) => Student)
    @JoinColumn()
    issuer: Student;

    @ManyToOne((type) => Pupil)
    @JoinColumn()
    pupil: Pupil;

    @ManyToOne((type) => Subcourse)
    subcourse: Subcourse;

    constructor(issuer: Student, pupil: Pupil, subcourse: Subcourse) {
        this.issuer = issuer;
        this.pupil = pupil;
        this.subcourse = subcourse;
    }
}
