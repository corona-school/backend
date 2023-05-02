import { Column, CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Prisma } from '@prisma/client';

export abstract class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({
        nullable: true,
    })
    firstname: string;

    @Column({
        nullable: true,
    })
    lastname: string;

    @Column({
        default: true,
    })
    active: boolean;

    @Index({ unique: true })
    @Column()
    email: string;

    @Index({ unique: true })
    @Column({
        nullable: true,
        default: null,
    })
    verification: string;

    @Column({
        type: 'timestamp',
        default: null,
        nullable: true,
    })
    verifiedAt: Date;

    @Index({ unique: true })
    @Column({
        nullable: true,
        default: null,
    })
    authToken: string;

    @Column({
        nullable: false,
        default: false,
    })
    authTokenUsed: boolean;

    @Column({
        nullable: true,
        default: null,
    })
    authTokenSent: Date;

    @Column({
        default: false,
    })
    isRedacted: boolean;

    @Column({
        type: 'timestamp',
        nullable: true,
        default: new Date(0),
    })
    lastTimeCheckedNotifications: Date;

    @Column({ nullable: true, type: 'json' })
    notificationPreferences: any;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    lastLogin?: Date;
}

export enum RegistrationSource {
    NORMAL,
    /* The school of the pupil cooperates with Lern-Fair */
    COOPERATION,
    DREHTUER,
    OTHER,
    /* 'Corona und Du' was a study conducted in Spring 2022 */
    CODU,
    /* Lern-Fair Plus participant */
    PLUS,
}
