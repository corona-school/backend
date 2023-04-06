import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TranslationLanguage {
    EN = 'en',
    DE = 'de',
}

export enum Recipients {
    STUDENTS = 'students',
    PUPILS = 'pupils',
}

@Entity()
export class ImportantInformation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'enum', enum: Recipients, nullable: false })
    recipients: Recipients;

    @Column({ type: 'text', nullable: true })
    navigateTo: string;

    @Column({
        type: 'enum',
        enum: TranslationLanguage,
        nullable: false,
        default: TranslationLanguage.DE,
    })
    language: TranslationLanguage;
}
