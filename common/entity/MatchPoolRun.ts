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

/* Records statistics from match pool runs */
@Entity()
export class MatchPoolRun {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    runAt: Date;

    @Column()
    matchingPool: string;

    @Column()
    matchesCreated: number;

    @Column({ type: "json" })
    stats: object;
}