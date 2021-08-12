import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_coaching_screeningCreateOrConnectWithoutStudentInput } from "../inputs/Project_coaching_screeningCreateOrConnectWithoutStudentInput";
import { Project_coaching_screeningCreateWithoutStudentInput } from "../inputs/Project_coaching_screeningCreateWithoutStudentInput";
import { Project_coaching_screeningWhereUniqueInput } from "../inputs/Project_coaching_screeningWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_coaching_screeningCreateNestedOneWithoutStudentInput {
  @TypeGraphQL.Field(_type => Project_coaching_screeningCreateWithoutStudentInput, {
    nullable: true
  })
  create?: Project_coaching_screeningCreateWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningCreateOrConnectWithoutStudentInput, {
    nullable: true
  })
  connectOrCreate?: Project_coaching_screeningCreateOrConnectWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereUniqueInput, {
    nullable: true
  })
  connect?: Project_coaching_screeningWhereUniqueInput | undefined;
}
