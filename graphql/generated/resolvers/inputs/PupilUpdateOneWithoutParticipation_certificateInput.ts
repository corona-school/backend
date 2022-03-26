import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutParticipation_certificateInput } from "../inputs/PupilCreateOrConnectWithoutParticipation_certificateInput";
import { PupilCreateWithoutParticipation_certificateInput } from "../inputs/PupilCreateWithoutParticipation_certificateInput";
import { PupilUpdateWithoutParticipation_certificateInput } from "../inputs/PupilUpdateWithoutParticipation_certificateInput";
import { PupilUpsertWithoutParticipation_certificateInput } from "../inputs/PupilUpsertWithoutParticipation_certificateInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilUpdateOneWithoutParticipation_certificateInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutParticipation_certificateInput, {
    nullable: true
  })
  create?: PupilCreateWithoutParticipation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutParticipation_certificateInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutParticipation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpsertWithoutParticipation_certificateInput, {
    nullable: true
  })
  upsert?: PupilUpsertWithoutParticipation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => PupilUpdateWithoutParticipation_certificateInput, {
    nullable: true
  })
  update?: PupilUpdateWithoutParticipation_certificateInput | undefined;
}
