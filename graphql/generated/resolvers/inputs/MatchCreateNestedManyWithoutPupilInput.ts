import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchCreateManyPupilInputEnvelope } from "../inputs/MatchCreateManyPupilInputEnvelope";
import { MatchCreateOrConnectWithoutPupilInput } from "../inputs/MatchCreateOrConnectWithoutPupilInput";
import { MatchCreateWithoutPupilInput } from "../inputs/MatchCreateWithoutPupilInput";
import { MatchWhereUniqueInput } from "../inputs/MatchWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MatchCreateNestedManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [MatchCreateWithoutPupilInput], {
    nullable: true
  })
  create?: MatchCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: MatchCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => MatchCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: MatchCreateManyPupilInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [MatchWhereUniqueInput], {
    nullable: true
  })
  connect?: MatchWhereUniqueInput[] | undefined;
}
