import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateNestedOneWithoutProject_coaching_screeningInput } from "../inputs/StudentCreateNestedOneWithoutProject_coaching_screeningInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_coaching_screeningCreateWithoutScreenerInput {
  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  success!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  comment?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  knowsCoronaSchoolFrom?: string | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutProject_coaching_screeningInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutProject_coaching_screeningInput | undefined;
}
