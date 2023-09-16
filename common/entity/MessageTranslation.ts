/* eslint-disable import/no-cycle */
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from './Notification';
import { TranslationTemplate } from '../notification/types';

export enum TranslationLanguage {
    EN = 'en',
    DE = 'de',
}

// See Notification.messageTranslations
@Entity()
export class MessageTranslation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Notification, (notification) => notification.messageTranslations)
    @JoinColumn()
    notification: Notification;

    @Column({ type: 'json', nullable: true })
    template: TranslationTemplate;

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
