import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchScalarWhereInput } from "../inputs/Project_matchScalarWhereInput";
import { Project_matchUpdateManyMutationInput } from "../inputs/Project_matchUpdateManyMutationInput";

@TypeGraphQL.InputType("Project_matchUpdateManyWithWhereWithoutPupilInput", {
  isAbstract: true
})
export class Project_matchUpdateManyWithWhereWithoutPupilInput {
  @TypeGraphQL.Field(_type => Project_matchScalarWhereInput, {
    nullable: false
  })
  where!: Project_matchScalarWhereInput;

  @TypeGraphQL.Field(_type => Project_matchUpdateManyMutationInput, {
    nullable: false
  })
  data!: Project_matchUpdateManyMutationInput;
}
