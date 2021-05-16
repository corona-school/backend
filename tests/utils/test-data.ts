import * as faker from "faker";
import { State } from "../../common/entity/State";
import { Student, Subject, TeacherModule } from "../../common/entity/Student";
import { Pupil } from "../../common/entity/Pupil";
import { Match } from "../../common/entity/Match";
import { Screener } from "../../common/entity/Screener";
import { Screening } from "../../common/entity/Screening";

// This file will contain some function to simpler create new database entities by just specifying the required properties - the remaining properties were automatically faked using faker.js

//seed faker
faker.seed(123);

export interface TestableStudentProps {
    active?: boolean;
    email?: string;
    state?: State;
    registrationDate?: Date;
    subjects?: Subject[];
    intern?: boolean;
    openMatchRequestCount?: number;
    screening?: Screening;
    openProjectMatchRequestCount?: number;
}
//creates a student using the given properties
export function createStudent(props?: TestableStudentProps, id?: number): Student {
    const s = new Student();

    if (id) { s.id = id; }

    s.wix_id = `Student-${faker.random.uuid()}`;
    s.firstname = faker.name.firstName();
    s.lastname = faker.name.lastName();
    s.active = props?.active ?? true;
    s.email = props?.email ?? faker.internet.email();
    s.isInstructor = true;
    s.isStudent = true;
    s.verification = null;
    s.verifiedAt = new Date("2021-01-01");
    s.authToken = faker.random.uuid();
    s.wix_creation_date = props?.registrationDate ?? faker.date.past();
    s.setSubjectsFormatted(props?.subjects ?? [{
        name: "Englisch",
        grade: {
            min: 1,
            max: 12
        }
    }]);
    s.module = (props?.intern ?? faker.random.boolean()) ? TeacherModule.INTERNSHIP : null;
    s.openMatchRequestCount = props?.openMatchRequestCount ?? faker.random.number({ min: 0, max: 5 });
    s.openProjectMatchRequestCount = props?.openProjectMatchRequestCount ?? faker.random.number({ min: 0, max: 5 });
    s.state = props?.state ?? faker.random.arrayElement(Object.values(State));
    s.screening = Promise.resolve(props?.screening ?? null);

    return s;
}

export interface TestablePupilProps {
    email?: string;
    state?: State;
    registrationDate?: Date;
    subjects?: Subject[];
    openMatchRequestCount?: number;
    matchingPriority?: number;
    grade?: number;
    openProjectMatchRequestCount?: number;
}
export function createPupil(props?: TestablePupilProps, id?: number) {
    const p = new Pupil();

    if (id) { p.id = id; }

    p.wix_id = `Pupil-${faker.random.uuid()}`;
    p.firstname = faker.name.firstName();
    p.lastname = faker.name.lastName();
    p.active = true;
    p.email = props?.email ?? faker.internet.email();
    p.isParticipant = true;
    p.isPupil = true;
    p.verification = null;
    p.verifiedAt = new Date("2021-01-01");
    p.authToken = faker.random.uuid();
    p.wix_creation_date = props?.registrationDate ?? faker.date.past();
    p.setSubjectsFormatted(props?.subjects ?? [
        {
            name: "Englisch"
        }
    ]);
    p.openMatchRequestCount = props?.openMatchRequestCount ?? faker.random.number({ min: 0, max: 1 });
    p.openProjectMatchRequestCount = props?.openProjectMatchRequestCount ?? faker.random.number({ min: 0, max: 1 });
    p.state = props?.state ?? faker.random.arrayElement(Object.values(State));
    p.matchingPriority = props?.matchingPriority ?? faker.random.number({ min: 0 });
    p.setGradeAsNumber(props?.grade ?? faker.random.number({ min: 1, max: 13 }));

    return p;
}

export interface TestableMatchProps {
    pupil?: Pupil;
    student?: Student;
    uuid?: string;
    dissolved?: boolean;
}
export function createMatch(props?: TestableMatchProps) {
    const pupil = props?.pupil ?? createPupil();
    const student = props?.student ?? createStudent();
    const uuid = props?.uuid ?? faker.random.uuid();

    const m = new Match(pupil, student, uuid);

    return m;
}

export interface TestableScreenerProps {
    verified?: boolean;
    active?: boolean;
    firstname?: string;
    lastname?: string;
    email?: string;
    verification?: string;
}
export function createScreener(props?: TestableScreenerProps) {
    const s = new Screener();

    s.verified = props?.verified ?? true;
    s.active = props?.active ?? true;
    s.firstname = props?.firstname ?? faker.name.firstName();
    s.lastname = props?.firstname ?? faker.name.lastName();
    s.email = props?.email ?? faker.internet.email();
    s.verification = props?.verification ?? null;

    return s;
}

export interface TestableScreeningProps {
    student?: Student;
    screener?: Screener;
    success?: boolean;
}
export function createScreening(props?: TestableScreeningProps) {
    const s = new Screening();
    s.student = props?.student ?? createStudent();
    s.screener = props?.screener ?? createScreener();
    s.success = props?.success ?? true;

    return s;
}