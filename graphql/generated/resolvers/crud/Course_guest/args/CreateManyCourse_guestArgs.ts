import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_guestCreateManyInput } from "../../../inputs/Course_guestCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyCourse_guestArgs {
  @TypeGraphQL.Field(_type => [Course_guestCreateManyInput], {
    nullable: false
  })
  data!: Course_guestCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
