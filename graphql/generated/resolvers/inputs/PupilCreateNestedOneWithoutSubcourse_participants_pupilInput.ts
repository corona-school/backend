import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutSubcourse_participants_pupilInput } from "../inputs/PupilCreateOrConnectWithoutSubcourse_participants_pupilInput";
import { PupilCreateWithoutSubcourse_participants_pupilInput } from "../inputs/PupilCreateWithoutSubcourse_participants_pupilInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilCreateNestedOneWithoutSubcourse_participants_pupilInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  create?: PupilCreateWithoutSubcourse_participants_pupilInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutSubcourse_participants_pupilInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;
}
