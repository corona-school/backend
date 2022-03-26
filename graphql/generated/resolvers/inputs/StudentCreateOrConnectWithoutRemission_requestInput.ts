import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutRemission_requestInput } from "../inputs/StudentCreateWithoutRemission_requestInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutRemission_requestInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutRemission_requestInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutRemission_requestInput, {
    nullable: false
  })
  create!: StudentCreateWithoutRemission_requestInput;
}
