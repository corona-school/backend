import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    Index,
    UpdateDateColumn,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
} from "typeorm";

export enum MailType {
    DISSOLVED = "dissolved",
    MATCHED = "matched",
    VERIFICATION = "verification",
    LOGINTOKEN = "logintoken",
    OTHER = "other",
}

@Entity()
export class Mail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: MailType,
        default: MailType.OTHER,
    })
    mailtype: MailType;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @Column()
    sendTimestamp: Date;

    @Column()
    sender: string;

    @Column()
    subject: string;

    @Column()
    html: string;

    @Column()
    text: string;

    @Column()
    receiver: string;
}
