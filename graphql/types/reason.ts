import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Decision { // GraphQL Type for common/util/decision
    @Field(type => Boolean)
    allowed: boolean;
    @Field(type => String, { nullable: true })
    reason?: string;
    @Field(type => Int, { nullable: true })
    limit?: number;
}