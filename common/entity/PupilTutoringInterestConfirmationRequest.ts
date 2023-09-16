/* eslint-disable import/no-cycle */
import { Column, CreateDateColumn, Entity, EntityManager, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Pupil } from './Pupil';

export enum InterestConfirmationStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    REFUSED = 'refused',
}

@Entity()
export class PupilTutoringInterestConfirmationRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({
        enum: InterestConfirmationStatus,
        default: InterestConfirmationStatus.PENDING,
    })
    status: InterestConfirmationStatus;

    // The Interest Confirmation is outdated or was already used to create match
    // A new interest confirmation needs to be requested, this is only kept for statistics
    @Column({ nullable: false, default: false })
    invalidated: boolean;

    @Index({ unique: true })
    @Column({
        nullable: false,
    })
    token: string;

    @Column({
        nullable: true,
        default: null,
    })
    reminderSentDate?: Date;

    @ManyToOne((type) => Pupil, (pupil) => pupil.tutoringInterestConfirmationRequest, {
        eager: false,
    })
    @JoinColumn()
    pupil: Pupil;

    hasSentReminder(): boolean {
        return this.reminderSentDate != null;
    }

    constructor(pupil: Pupil, token: string) {
        this.pupil = pupil;
        this.token = token;
    }
}
