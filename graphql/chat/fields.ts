import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
class Contact {
    @Field((_type) => String)
    userID: string;
    @Field((_type) => String)
    talkJsId: string;
    @Field((_type) => String, { nullable: true })
    firstname: string;
    @Field((_type) => String, { nullable: true })
    lastname: string;
}
