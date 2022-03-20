import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutParticipation_certificateInput } from "../inputs/PupilCreateOrConnectWithoutParticipation_certificateInput";
import { PupilCreateWithoutParticipation_certificateInput } from "../inputs/PupilCreateWithoutParticipation_certificateInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilCreateNestedOneWithoutParticipation_certificateInput", {
  isAbstract: true
})
export class PupilCreateNestedOneWithoutParticipation_certificateInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutParticipation_certificateInput, {
    nullable: true
  })
  create?: PupilCreateWithoutParticipation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutParticipation_certificateInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutParticipation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;
}
