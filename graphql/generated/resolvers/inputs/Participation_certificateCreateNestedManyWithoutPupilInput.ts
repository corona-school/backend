import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateCreateManyPupilInputEnvelope } from "../inputs/Participation_certificateCreateManyPupilInputEnvelope";
import { Participation_certificateCreateOrConnectWithoutPupilInput } from "../inputs/Participation_certificateCreateOrConnectWithoutPupilInput";
import { Participation_certificateCreateWithoutPupilInput } from "../inputs/Participation_certificateCreateWithoutPupilInput";
import { Participation_certificateWhereUniqueInput } from "../inputs/Participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType("Participation_certificateCreateNestedManyWithoutPupilInput", {
  isAbstract: true
})
export class Participation_certificateCreateNestedManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [Participation_certificateCreateWithoutPupilInput], {
    nullable: true
  })
  create?: Participation_certificateCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: Participation_certificateCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: Participation_certificateCreateManyPupilInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateWhereUniqueInput], {
    nullable: true
  })
  connect?: Participation_certificateWhereUniqueInput[] | undefined;
}
