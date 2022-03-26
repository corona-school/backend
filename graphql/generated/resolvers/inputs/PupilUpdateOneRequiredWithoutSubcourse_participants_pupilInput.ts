import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutSubcourse_participants_pupilInput } from "../inputs/PupilCreateOrConnectWithoutSubcourse_participants_pupilInput";
import { PupilCreateWithoutSubcourse_participants_pupilInput } from "../inputs/PupilCreateWithoutSubcourse_participants_pupilInput";
import { PupilUpdateWithoutSubcourse_participants_pupilInput } from "../inputs/PupilUpdateWithoutSubcourse_participants_pupilInput";
import { PupilUpsertWithoutSubcourse_participants_pupilInput } from "../inputs/PupilUpsertWithoutSubcourse_participants_pupilInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilUpdateOneRequiredWithoutSubcourse_participants_pupilInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  create?: PupilCreateWithoutSubcourse_participants_pupilInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutSubcourse_participants_pupilInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpsertWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  upsert?: PupilUpsertWithoutSubcourse_participants_pupilInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpdateWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  update?: PupilUpdateWithoutSubcourse_participants_pupilInput | undefined;
}
