import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchUpdateWithoutStudentInput } from "../inputs/Project_matchUpdateWithoutStudentInput";
import { Project_matchWhereUniqueInput } from "../inputs/Project_matchWhereUniqueInput";

@TypeGraphQL.InputType("Project_matchUpdateWithWhereUniqueWithoutStudentInput", {
  isAbstract: true
})
export class Project_matchUpdateWithWhereUniqueWithoutStudentInput {
  @TypeGraphQL.Field(_type => Project_matchWhereUniqueInput, {
    nullable: false
  })
  where!: Project_matchWhereUniqueInput;

  @TypeGraphQL.Field(_type => Project_matchUpdateWithoutStudentInput, {
    nullable: false
  })
  data!: Project_matchUpdateWithoutStudentInput;
}
