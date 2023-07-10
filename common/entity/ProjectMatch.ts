import { Column, CreateDateColumn, Entity, EntityManager, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Student } from './Student';
import { Pupil } from './Pupil';
import { v4 as generateUUID } from 'uuid';

@Entity()
@Unique('UQ_PJ_MATCH', ['student', 'pupil'])
export class ProjectMatch {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    uuid: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne((type) => Student, (student) => student.projectMatches, {
        eager: true,
    })
    @JoinColumn()
    student: Student;

    @ManyToOne((type) => Pupil, (pupil) => pupil.projectMatches, {
        eager: true,
    })
    @JoinColumn()
    pupil: Pupil;

    @Column({
        default: false,
    })
    dissolved: boolean;

    @Column({
        default: null,
        nullable: true,
    })
    dissolveReason: number;

    constructor(pupil: Pupil, student: Student) {
        this.pupil = pupil;
        this.student = student;
        this.uuid = generateUUID();
    }
}
