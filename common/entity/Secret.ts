import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";


export enum SecretType {
    PASSWORD = "PASSWORD",
    TOKEN = "TOKEN",
    // Token sent via Email
    // If a user proves they know the token, they implicitly validate their email address
    EMAIL_TOKEN = "EMAIL_TOKEN"
}

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

    @Column({ enum: SecretType })
    type: SecretType;

    @Column()
    secret: string;

    @Column({ nullable: true })
    expiresAt?: Date;

    @Column({ nullable: true })
    lastUsed?: Date;
}
