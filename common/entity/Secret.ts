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
class Secret {
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

    @Column()
    expiresAt?: Date;

    @Column()
    lastUsed?: Date;
}

export enum SecretType {
    PASSWORD,
    TOKEN,
    EMAIL_TOKEN
}