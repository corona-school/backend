import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

// Secret in the sense of https://en.wikipedia.org/wiki/Shared_secret
//  used to prove the user's identity
@Entity()
export class Secret {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    userId: string;

    @Column()
    type: SecretType;

    @Column()
    secret: string;

    @Column({ nullable: true })
    expiresAt?: Date;

    @Column({ nullable: true })
    lastUsed?: Date;
}

export enum SecretType {
    PASSWORD = "PASSWORD",
    TOKEN = "TOKEN",
    EMAIL_TOKEN = "EMAIL_TOKEN"
}