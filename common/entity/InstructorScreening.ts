import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    UpdateDateColumn,
    CreateDateColumn,
    ManyToOne,
    getManager,
} from "typeorm";
import { ApiScreeningResult } from "../dto/ApiScreeningResult";
import { getScreenerByEmail, Screener } from "./Screener";
import { Student } from "./Student";

@Entity()
export class InstructorScreening {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    success: boolean; //verified or not verified

    @Column({
        nullable: true,
    })
    comment: string;

    @Column({
        nullable: true,
    })
    knowsCoronaSchoolFrom: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @ManyToOne((type) => Screener, (screener) => screener.screenings, {
        eager: true,
    })
    @JoinColumn()
    screener: Screener;

    @OneToOne((type) => Student, (student) => student.screening, {
        eager: true,
    })
    @JoinColumn()
    student: Student;

    async addScreeningResult(screeningResult: ApiScreeningResult) {
        this.success =
            screeningResult.verified === undefined
                ? this.success
                : screeningResult.verified;
        this.comment =
            screeningResult.commentScreener === undefined
                ? this.comment
                : screeningResult.commentScreener;
        this.knowsCoronaSchoolFrom =
            screeningResult.knowscsfrom === undefined
                ? this.knowsCoronaSchoolFrom
                : screeningResult.knowscsfrom;
        this.screener = await getScreenerByEmail(
            getManager(),
            screeningResult.screenerEmail
        );
    }
}
