import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchUpdateWithoutPupilInput } from "../inputs/Project_matchUpdateWithoutPupilInput";
import { Project_matchWhereUniqueInput } from "../inputs/Project_matchWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_matchUpdateWithWhereUniqueWithoutPupilInput {
  @TypeGraphQL.Field(_type => Project_matchWhereUniqueInput, {
    nullable: false
  })
  where!: Project_matchWhereUniqueInput;

  @TypeGraphQL.Field(_type => Project_matchUpdateWithoutPupilInput, {
    nullable: false
  })
  data!: Project_matchUpdateWithoutPupilInput;
}
