import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutSubcourse_waiting_list_pupilInput } from "../inputs/PupilCreateOrConnectWithoutSubcourse_waiting_list_pupilInput";
import { PupilCreateWithoutSubcourse_waiting_list_pupilInput } from "../inputs/PupilCreateWithoutSubcourse_waiting_list_pupilInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilCreateNestedOneWithoutSubcourse_waiting_list_pupilInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutSubcourse_waiting_list_pupilInput, {
    nullable: true
  })
  create?: PupilCreateWithoutSubcourse_waiting_list_pupilInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutSubcourse_waiting_list_pupilInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutSubcourse_waiting_list_pupilInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;
}
