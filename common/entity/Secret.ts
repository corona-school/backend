import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum SecretType {
    PASSWORD = 'PASSWORD',
    // Tokens issued directly to the user
    // These are long living as we assume the user keeps them secret
    TOKEN = 'TOKEN',
    // Token sent via Email
    // If a user proves they know the token, they implicitly validate their email address
    // Also this token can only be used once, as Emails have a large surface of being exposed
    EMAIL_TOKEN = 'EMAIL_TOKEN',
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

    @Column({ type: 'enum', enum: SecretType })
    type: SecretType;

    @Column()
    secret: string;

    @Column({ nullable: true })
    expiresAt?: Date;

    @Column({ nullable: true })
    lastUsed?: Date;

    // for EMAIL_TOKEN the description is used for new email
    @Column({ nullable: true })
    description: string;
}
