import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tagUpdateInput } from "../../../inputs/Course_tagUpdateInput";
import { Course_tagWhereUniqueInput } from "../../../inputs/Course_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateCourse_tagArgs {
  @TypeGraphQL.Field(_type => Course_tagUpdateInput, {
    nullable: false
  })
  data!: Course_tagUpdateInput;

  @TypeGraphQL.Field(_type => Course_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Course_tagWhereUniqueInput;
}
