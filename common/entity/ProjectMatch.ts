import {
    Column,
    CreateDateColumn,
    Entity,
    EntityManager,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn
} from "typeorm";
import { Student } from "./Student";
import { Pupil } from "./Pupil";
import { v4 as generateUUID } from "uuid";
import { ProjectField } from "../jufo/projectFields";

@Entity()
@Unique("UQ_PJ_MATCH", ["student", "pupil"])
export class ProjectMatch {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    uuid: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @ManyToOne((type) => Student, (student) => student.projectMatches, {
        eager: true
    })
    @JoinColumn()
    student: Student;

    @ManyToOne((type) => Pupil, (pupil) => pupil.projectMatches, {
        eager: true
    })
    @JoinColumn()
    pupil: Pupil;

    @Column({
        default: false
    })
    dissolved: boolean;

    @Column({
        default: null,
        nullable: true
    })
    dissolveReason: number;

    jitsiLink(): string {
        return `https://meet.jit.si/CoronaSchool-ProjectCoaching-${encodeURIComponent(this.uuid)}`;
    }

    constructor(pupil: Pupil, student: Student) {
        this.pupil = pupil;
        this.student = student;
        this.uuid = generateUUID();
    }

    async overlappingProjectFields(): Promise<ProjectField[]> {
        return await this.pupil.overlappingProjectFieldsWithCoach(this.student);
    }
}

export async function getProjectMatchByID(id: number, manager: EntityManager): Promise<ProjectMatch> {
    return manager.findOne(ProjectMatch, {
        id: id
    });
}

///Takes the given project matches instances and re-queries them from the database, returning new instances for all of them.
export async function reloadProjectMatchesInstances(projectMatches: ProjectMatch[], manager: EntityManager): Promise<ProjectMatch[]> {
    return await Promise.all(projectMatches.map(async m => await getProjectMatchByID(m.id, manager)));
}