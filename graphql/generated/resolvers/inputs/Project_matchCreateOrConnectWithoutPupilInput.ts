import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchCreateWithoutPupilInput } from "../inputs/Project_matchCreateWithoutPupilInput";
import { Project_matchWhereUniqueInput } from "../inputs/Project_matchWhereUniqueInput";

@TypeGraphQL.InputType("Project_matchCreateOrConnectWithoutPupilInput", {
  isAbstract: true
})
export class Project_matchCreateOrConnectWithoutPupilInput {
  @TypeGraphQL.Field(_type => Project_matchWhereUniqueInput, {
    nullable: false
  })
  where!: Project_matchWhereUniqueInput;

  @TypeGraphQL.Field(_type => Project_matchCreateWithoutPupilInput, {
    nullable: false
  })
  create!: Project_matchCreateWithoutPupilInput;
}
