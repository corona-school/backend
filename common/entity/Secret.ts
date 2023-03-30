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

    // The description depends on the type of the Secret:
    // - PASSWORD: currently unused
    // - TOKEN: Describes the reason the token was issued, i.e. if it was issued by Support or on which device the token was issued
    // - EMAIL_TOKEN the email to which the token was sent
    //   - if not set, the user logs in via the email in their account and was not yet authenticated,
    //       when they use the token we verify the email and log them in
    //   - if set, the user requests to be logged in with a new email. When they log in using the token, we update the email in their profile and also verify it
    //      => this MUST only be used by authenticated users, otherwise accounts could be taken over!

    @Column({ nullable: true })
    description: string;
}
