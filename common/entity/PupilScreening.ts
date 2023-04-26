import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Pupil } from './Pupil';

export enum PupilScreeningStatus {
    PENDING, // default
    SUCCESS,
    REJECTION,
    DISPUTE,
}

@Entity()
export class PupilScreening {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => Pupil, (pupil) => pupil.screenings)
    pupil: Pupil;

    @Column({
        type: 'enum',
        enum: PupilScreeningStatus,
        default: PupilScreeningStatus.PENDING,
    })
    status: PupilScreeningStatus;

    @Column({ default: false })
    invalidated: boolean;

    @Column({ nullable: true })
    comment?: string;
}
