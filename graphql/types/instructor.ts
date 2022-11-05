import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class Instructor {
    @Field((_type) => Int)
    id: number;
    @Field((_type) => String)
    firstname: string;
    @Field((_type) => String)
    lastname: string;
    @Field((_type) => String)
    aboutMe: string;
}
