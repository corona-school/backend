import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from './Notification';

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

    @Column({ type: 'json', nullable: false })
    template: any;

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
