import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_instructors_studentCreateManyInput } from "../../../inputs/Subcourse_instructors_studentCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManySubcourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => [Subcourse_instructors_studentCreateManyInput], {
    nullable: false
  })
  data!: Subcourse_instructors_studentCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
