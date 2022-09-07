/* This definition just exists because of the double maintenance of TypeORM and Prisma.
   For queries, use Prisma! */

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attachment {
    // non-natural primary key
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    uploaderID: string;

    @Column()
    filename: string;

    @Column()
    size: number;

    @Column()
    attachmentGroupId: string;

    @Column({ type: 'timestamp' })
    date: Date;
}
