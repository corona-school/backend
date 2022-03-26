import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchCreateWithoutStudentInput } from "../inputs/Project_matchCreateWithoutStudentInput";
import { Project_matchWhereUniqueInput } from "../inputs/Project_matchWhereUniqueInput";

@TypeGraphQL.InputType("Project_matchCreateOrConnectWithoutStudentInput", {
  isAbstract: true
})
export class Project_matchCreateOrConnectWithoutStudentInput {
  @TypeGraphQL.Field(_type => Project_matchWhereUniqueInput, {
    nullable: false
  })
  where!: Project_matchWhereUniqueInput;

  @TypeGraphQL.Field(_type => Project_matchCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Project_matchCreateWithoutStudentInput;
}
