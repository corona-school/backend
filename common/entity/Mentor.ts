import {Person} from "./Person";
import {Column, Entity} from "typeorm";

export enum Division {
    FACEBOOK = "facebook",
    EMAIL = "email",
    EVENTS = "events",
    VIDEO = "video",
    SUPERVISION = "supervision"
}

export enum Expertise {
    LANGUAGE = "language difficulties and communication",
    SPECIALIZED = "specialized expertise in subjects",
    EDUCATIONAL = "educational and didactic expertise",
    TECHSUPPORT = "technical support",
    SELFORGANIZATION = "self-organization"
}

@Entity()
export class Mentor extends Person {

    @Column({
        name: "division",
        type: "enum",
        enum: Division,
        array: true,
        nullable: false
    })
    division: Division[];

    @Column({
        name: "expertise",
        type: "enum",
        enum: Expertise,
        array: true,
        nullable: false
    })
    expertise: Expertise[];

    // subjects: refer to normal subject list (if division is supervision OR expertise is "specialized expertise in subjects")
    @Column({
        nullable: true
    })
    subjects: string;

    // teachingExperience: boolean (if division is supervision OR expertise is "specialized expertise in subjects")
    @Column({
        nullable: true
    })
    teachingExperience: boolean;

    @Column({
        nullable: true
    })
    message: string;

    @Column({
        nullable: true
    })
    description: string;

    @Column({
        nullable: true
    })
    imageUrl: string;
}
