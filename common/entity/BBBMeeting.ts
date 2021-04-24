import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
export class BBBMeeting {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @Column()
    meetingID: string;

    @Column({ nullable: true })
    meetingName: string;

    @Column({ nullable: true })
    attendeePW: string;

    @Column({ nullable: true })
    moderatorPW: string;

    @Column({ nullable: true })
    alternativeUrl: string;
}
