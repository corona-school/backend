import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Instructor_screeningUpdateManyMutationInput } from "../../../inputs/Instructor_screeningUpdateManyMutationInput";
import { Instructor_screeningWhereInput } from "../../../inputs/Instructor_screeningWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyInstructor_screeningArgs {
  @TypeGraphQL.Field(_type => Instructor_screeningUpdateManyMutationInput, {
    nullable: false
  })
  data!: Instructor_screeningUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Instructor_screeningWhereInput, {
    nullable: true
  })
  where?: Instructor_screeningWhereInput | undefined;
}
