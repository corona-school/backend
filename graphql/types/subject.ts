import { Field, InputType, Int, ObjectType } from "type-graphql";

// c.f. https://github.com/MichalLytek/type-graphql/issues/76

@InputType("RangeInput")
@ObjectType("Range")
class Range { // GraphQL Type for common/entity/Student -> Subject.range
    @Field(type => Int)
    min: number;
    @Field(type => Int)
    max: number;
}

@InputType("SubjectInput")
@ObjectType("Subject")
export class Subject { // GraphQL Type for common/entity/Student -> Subject
    @Field()
    name: string;

    @Field(type => Range, { nullable: true })
    grade: Range;
}