import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchCreateManyStudentInputEnvelope } from "../inputs/Project_matchCreateManyStudentInputEnvelope";
import { Project_matchCreateOrConnectWithoutStudentInput } from "../inputs/Project_matchCreateOrConnectWithoutStudentInput";
import { Project_matchCreateWithoutStudentInput } from "../inputs/Project_matchCreateWithoutStudentInput";
import { Project_matchWhereUniqueInput } from "../inputs/Project_matchWhereUniqueInput";

@TypeGraphQL.InputType("Project_matchCreateNestedManyWithoutStudentInput", {
  isAbstract: true
})
export class Project_matchCreateNestedManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Project_matchCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Project_matchCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Project_matchCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Project_matchCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Project_matchCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Project_matchWhereUniqueInput], {
    nullable: true
  })
  connect?: Project_matchWhereUniqueInput[] | undefined;
}
