import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tagCreateInput } from "../../../inputs/Course_tagCreateInput";
import { Course_tagUpdateInput } from "../../../inputs/Course_tagUpdateInput";
import { Course_tagWhereUniqueInput } from "../../../inputs/Course_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertCourse_tagArgs {
  @TypeGraphQL.Field(_type => Course_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Course_tagWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_tagCreateInput, {
    nullable: false
  })
  create!: Course_tagCreateInput;

  @TypeGraphQL.Field(_type => Course_tagUpdateInput, {
    nullable: false
  })
  update!: Course_tagUpdateInput;
}
