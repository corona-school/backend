import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutSubcourse_waiting_list_pupilInput } from "../inputs/PupilCreateOrConnectWithoutSubcourse_waiting_list_pupilInput";
import { PupilCreateWithoutSubcourse_waiting_list_pupilInput } from "../inputs/PupilCreateWithoutSubcourse_waiting_list_pupilInput";
import { PupilUpdateWithoutSubcourse_waiting_list_pupilInput } from "../inputs/PupilUpdateWithoutSubcourse_waiting_list_pupilInput";
import { PupilUpsertWithoutSubcourse_waiting_list_pupilInput } from "../inputs/PupilUpsertWithoutSubcourse_waiting_list_pupilInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilUpdateOneRequiredWithoutSubcourse_waiting_list_pupilInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutSubcourse_waiting_list_pupilInput, {
    nullable: true
  })
  create?: PupilCreateWithoutSubcourse_waiting_list_pupilInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutSubcourse_waiting_list_pupilInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutSubcourse_waiting_list_pupilInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpsertWithoutSubcourse_waiting_list_pupilInput, {
    nullable: true
  })
  upsert?: PupilUpsertWithoutSubcourse_waiting_list_pupilInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpdateWithoutSubcourse_waiting_list_pupilInput, {
    nullable: true
  })
  update?: PupilUpdateWithoutSubcourse_waiting_list_pupilInput | undefined;
}
