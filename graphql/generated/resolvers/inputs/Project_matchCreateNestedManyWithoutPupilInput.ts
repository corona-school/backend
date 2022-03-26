import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchCreateManyPupilInputEnvelope } from "../inputs/Project_matchCreateManyPupilInputEnvelope";
import { Project_matchCreateOrConnectWithoutPupilInput } from "../inputs/Project_matchCreateOrConnectWithoutPupilInput";
import { Project_matchCreateWithoutPupilInput } from "../inputs/Project_matchCreateWithoutPupilInput";
import { Project_matchWhereUniqueInput } from "../inputs/Project_matchWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_matchCreateNestedManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [Project_matchCreateWithoutPupilInput], {
    nullable: true
  })
  create?: Project_matchCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: Project_matchCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => Project_matchCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: Project_matchCreateManyPupilInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Project_matchWhereUniqueInput], {
    nullable: true
  })
  connect?: Project_matchWhereUniqueInput[] | undefined;
}
