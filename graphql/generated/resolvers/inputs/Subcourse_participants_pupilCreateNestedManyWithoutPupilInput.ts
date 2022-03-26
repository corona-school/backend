import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_participants_pupilCreateManyPupilInputEnvelope } from "../inputs/Subcourse_participants_pupilCreateManyPupilInputEnvelope";
import { Subcourse_participants_pupilCreateOrConnectWithoutPupilInput } from "../inputs/Subcourse_participants_pupilCreateOrConnectWithoutPupilInput";
import { Subcourse_participants_pupilCreateWithoutPupilInput } from "../inputs/Subcourse_participants_pupilCreateWithoutPupilInput";
import { Subcourse_participants_pupilWhereUniqueInput } from "../inputs/Subcourse_participants_pupilWhereUniqueInput";

@TypeGraphQL.InputType("Subcourse_participants_pupilCreateNestedManyWithoutPupilInput", {
  isAbstract: true
})
export class Subcourse_participants_pupilCreateNestedManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilCreateWithoutPupilInput], {
    nullable: true
  })
  create?: Subcourse_participants_pupilCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: Subcourse_participants_pupilCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: Subcourse_participants_pupilCreateManyPupilInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilWhereUniqueInput], {
    nullable: true
  })
  connect?: Subcourse_participants_pupilWhereUniqueInput[] | undefined;
}
