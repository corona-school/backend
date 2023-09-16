/* eslint-disable import/no-cycle */
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique } from 'typeorm';
import { Student } from './Student';

export enum ProjectField {
    ARBEITSWELT = 'Arbeitswelt',
    BIOLOGIE = 'Biologie',
    CHEMIE = 'Chemie',
    GEO_RAUM = 'Geo-und-Raumwissenschaften', //don't use spaces here due to a typeorm issue, see https://github.com/typeorm/typeorm/issues/5275
    MATHE_INFO = 'Mathematik/Informatik',
    PHYSIK = 'Physik',
    TECHNIK = 'Technik',
}

@Entity()
@Unique('UQ_PROJECT_FIELDS', ['projectField', 'student'])
export class ProjectFieldWithGradeRestriction {
    /*
     * General metadata
     */
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    /*
     * Project Field data
     */
    @Column({
        type: 'enum',
        enum: ProjectField,
        nullable: false,
    })
    projectField: ProjectField;

    /*
     * Grade restrictions
     */
    @Column({
        nullable: true,
        default: null,
    })
    min: number;

    @Column({
        nullable: true,
        default: null,
    })
    max: number;

    /*
     *  Relationships
     */
    @ManyToOne((type) => Student, (student) => student.projectFields, {
        nullable: false,
    })
    student: Promise<Student>;

    /*
     *  Constructor
     */
    constructor(projectField: ProjectField, min?: number, max?: number) {
        this.projectField = projectField;
        this.min = min;
        this.max = max;
    }
}
