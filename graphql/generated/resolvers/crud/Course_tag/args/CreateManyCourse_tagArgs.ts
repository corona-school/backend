import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_tagCreateManyInput } from "../../../inputs/Course_tagCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyCourse_tagArgs {
  @TypeGraphQL.Field(_type => [Course_tagCreateManyInput], {
    nullable: false
  })
  data!: Course_tagCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
