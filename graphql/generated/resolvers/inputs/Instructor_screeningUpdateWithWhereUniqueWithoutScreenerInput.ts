import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningUpdateWithoutScreenerInput } from "../inputs/Instructor_screeningUpdateWithoutScreenerInput";
import { Instructor_screeningWhereUniqueInput } from "../inputs/Instructor_screeningWhereUniqueInput";

@TypeGraphQL.InputType("Instructor_screeningUpdateWithWhereUniqueWithoutScreenerInput", {
  isAbstract: true
})
export class Instructor_screeningUpdateWithWhereUniqueWithoutScreenerInput {
  @TypeGraphQL.Field(_type => Instructor_screeningWhereUniqueInput, {
    nullable: false
  })
  where!: Instructor_screeningWhereUniqueInput;

  @TypeGraphQL.Field(_type => Instructor_screeningUpdateWithoutScreenerInput, {
    nullable: false
  })
  data!: Instructor_screeningUpdateWithoutScreenerInput;
}
