import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchCreateManyStudentInputEnvelope } from "../inputs/MatchCreateManyStudentInputEnvelope";
import { MatchCreateOrConnectWithoutStudentInput } from "../inputs/MatchCreateOrConnectWithoutStudentInput";
import { MatchCreateWithoutStudentInput } from "../inputs/MatchCreateWithoutStudentInput";
import { MatchWhereUniqueInput } from "../inputs/MatchWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MatchCreateNestedManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [MatchCreateWithoutStudentInput], {
    nullable: true
  })
  create?: MatchCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: MatchCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => MatchCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: MatchCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [MatchWhereUniqueInput], {
    nullable: true
  })
  connect?: MatchWhereUniqueInput[] | undefined;
}
