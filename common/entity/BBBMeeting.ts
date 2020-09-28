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

    @Column()
    meetingName: string;

    @Column()
    attendeePW: string;

    @Column()
    moderatorPW: string;

}
