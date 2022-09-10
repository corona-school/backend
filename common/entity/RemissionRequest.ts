import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './Student';

@Entity()
export class RemissionRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Index({ unique: true })
    @Column()
    uuid: string;

    @OneToOne((type) => Student, (student) => student.remissionRequest)
    @JoinColumn()
    student: Student;
}
