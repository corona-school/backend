import { Field, InputType, Int, ObjectType } from 'type-graphql';

// c.f. https://github.com/MichalLytek/type-graphql/issues/76

@InputType('RangeInput')
@ObjectType('Range')
class Range {
    @Field((type) => Int)
    min: number;
    @Field((type) => Int)
    max: number;
}

@InputType('SubjectInput')
@ObjectType('Subject')
export class Subject {
    @Field()
    name: string;

    @Field((type) => Range, { nullable: true })
    grade: Range;

    @Field((type) => Boolean, { nullable: true })
    mandatory: boolean;
}

@ObjectType()
class WaitingDaysRange {
    @Field()
    from: number;

    @Field()
    to: number;
}
@ObjectType()
export class SubjectStatsForPupils {
    @Field()
    subject: string;

    @Field((type) => WaitingDaysRange, { nullable: true })
    waitingDaysRange?: WaitingDaysRange;
}

@ObjectType()
export class SubjectStatsForStudents {
    @Field()
    subject: string;

    @Field((type) => Int, { nullable: true })
    pupilsWaiting?: number;

    @Field((type) => [Int], { nullable: true })
    gradesAvailable?: number[];
}
