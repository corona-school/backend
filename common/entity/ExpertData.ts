import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Student} from "./Student";
import {ExpertiseTag} from "./ExpertiseTag";
import {Col} from "sequelize/types/lib/utils";
import {ExpertAllowedIndication} from "../jufo/expertAllowedIndication";

@Entity()
export class ExpertData {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @OneToOne((type) => Student, (student) => student.expertData, {
        eager: true
    })
    @JoinColumn()
    student: Student;

    @Column()
    contactEmail: string;

    @Column({
        nullable: true
    })
    description: string;

    @ManyToMany((type) => ExpertiseTag, expertiseTags => expertiseTags.expertData, {
        eager: true
    })
    @JoinTable()
    expertiseTags: ExpertiseTag[];

    @Column({
        default: false
    })
    active: boolean;

    @Column({
        type: "enum",
        default: ExpertAllowedIndication.PENDING,
        enum: ExpertAllowedIndication
    })
    allowed: ExpertAllowedIndication;
}