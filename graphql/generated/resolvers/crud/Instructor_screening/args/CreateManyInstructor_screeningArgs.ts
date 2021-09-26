import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Instructor_screeningCreateManyInput } from "../../../inputs/Instructor_screeningCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyInstructor_screeningArgs {
  @TypeGraphQL.Field(_type => [Instructor_screeningCreateManyInput], {
    nullable: false
  })
  data!: Instructor_screeningCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
