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
