import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Instructor_screeningWhereInput } from "../../../inputs/Instructor_screeningWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyInstructor_screeningArgs {
  @TypeGraphQL.Field(_type => Instructor_screeningWhereInput, {
    nullable: true
  })
  where?: Instructor_screeningWhereInput | undefined;
}
