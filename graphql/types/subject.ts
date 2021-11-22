import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
class Range { // GraphQL Type for common/entity/Student -> Subject.range
    @Field(type => Int)
    min: number;
    @Field(type => Int)
    max: number;
}

@ObjectType()
export class Subject { // GraphQL Type for common/entity/Student -> Subject
    @Field()
    name: string;

    @Field(type => Range)
    grade: Range;
}