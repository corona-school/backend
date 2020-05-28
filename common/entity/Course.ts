import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import { Student } from "./Student";

export enum CourseState {
    CREATED = "created",
    SUBMITTED = "submitted",
    ALLOWED = "allowed",
    DENIED = "denied",
    CANCELLED = "cancelled"
}

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;    

    @ManyToOne(type=>Student, student => student.courses)
    @JoinColumn()
    instructor: Student;

    @Column()
    name: string;

    @Column()
    outline: string;
    
    @Column()
    description: string;
    
    @Column()
    motivation: string;  

    @Column()
    requirements: string;

    @Column({
        nullable: true
    })
    imageUrl: string;

    @Column()
    minGrade: number;

    @Column()
    maxGrade: number;

    @Column()
    maxRecipients: number;

    @Column()
    categoryId: number;

    @Column()
    joinAfterStart: boolean;

    @Column()
    startDate: Date;

    @Column()
    duration: number;

    @Column()
    frequency: number;

    @Column({
        type: "enum",
        enum: CourseState,
        default: CourseState.CREATED
    })
    courseState: CourseState;

}
