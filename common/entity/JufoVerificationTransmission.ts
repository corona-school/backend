import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './Student';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class JufoVerificationTransmission {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @Column({
        nullable: false,
    })
    uuid: string;

    @OneToOne((type) => Student, (student) => student.jufoVerificationTransmission)
    @JoinColumn()
    student: Student;

    constructor() {
        this.uuid = uuidv4();
    }
}
