import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningScalarWhereInput } from "../inputs/Instructor_screeningScalarWhereInput";
import { Instructor_screeningUpdateManyMutationInput } from "../inputs/Instructor_screeningUpdateManyMutationInput";

@TypeGraphQL.InputType("Instructor_screeningUpdateManyWithWhereWithoutScreenerInput", {
  isAbstract: true
})
export class Instructor_screeningUpdateManyWithWhereWithoutScreenerInput {
  @TypeGraphQL.Field(_type => Instructor_screeningScalarWhereInput, {
    nullable: false
  })
  where!: Instructor_screeningScalarWhereInput;

  @TypeGraphQL.Field(_type => Instructor_screeningUpdateManyMutationInput, {
    nullable: false
  })
  data!: Instructor_screeningUpdateManyMutationInput;
}
