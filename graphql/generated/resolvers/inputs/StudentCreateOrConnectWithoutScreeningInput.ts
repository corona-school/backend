import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutScreeningInput } from "../inputs/StudentCreateWithoutScreeningInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutScreeningInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutScreeningInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutScreeningInput, {
    nullable: false
  })
  create!: StudentCreateWithoutScreeningInput;
}
