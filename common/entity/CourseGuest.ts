import { Column, CreateDateColumn, Entity, EntityManager, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Course } from './Course';
import { randomBytes } from 'crypto';
import { Student } from './Student';

@Entity()
export class CourseGuest {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Index({ unique: true })
    @Column({
        nullable: false,
    })
    token: string;

    @Column({
        nullable: false,
    })
    firstname: string;

    @Column({
        nullable: false,
    })
    lastname: string;

    @Column({
        nullable: false,
    })
    email: string;

    @ManyToOne((type) => Course, (course) => course.guests)
    course: Course;

    @ManyToOne((type) => Student, (course) => course.invitedGuests)
    inviter: Student;

    constructor(email: string, firstname: string, lastname: string, course: Course, inviter: Student, token: string) {
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.course = course;
        this.inviter = inviter;
        this.token = token;
    }

    /// The link that someone could use to go to the video chat and that is no direct BBB link, because this way, we can keep the BBB endpoint flexible
    getPublicUsableLink(): string {
        return `https://my.lern-fair.de/video/${this.token}`;
    }
}

export function getCourseGuestLink(courseGuest: Pick<CourseGuest, 'token'>): string {
    return `https://my.lern-fair.de/video/${courseGuest.token}`;
}

export async function generateNewCourseGuestToken(manager: EntityManager): Promise<string> {
    let token;
    do {
        token = randomBytes(48).toString('hex');
    } while (
        await manager.findOne(CourseGuest, {
            where: {
                token: token,
            },
        })
    );

    return token;
}
