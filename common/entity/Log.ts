import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import LogType from "../transactionlog/types/LogType";

@Entity()
export default class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: LogType,
        default: LogType.MISC,
    })
    logtype: LogType;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @Column()
    user: string; // User identifier. For students and pupils the wix_id is used

    @Column()
    data: string;
}
