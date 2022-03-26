import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutInstructor_screeningInput } from "../inputs/StudentCreateOrConnectWithoutInstructor_screeningInput";
import { StudentCreateWithoutInstructor_screeningInput } from "../inputs/StudentCreateWithoutInstructor_screeningInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentCreateNestedOneWithoutInstructor_screeningInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutInstructor_screeningInput, {
    nullable: true
  })
  create?: StudentCreateWithoutInstructor_screeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutInstructor_screeningInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutInstructor_screeningInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
