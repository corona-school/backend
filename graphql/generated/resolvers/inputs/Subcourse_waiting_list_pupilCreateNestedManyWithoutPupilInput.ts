import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilCreateManyPupilInputEnvelope } from "../inputs/Subcourse_waiting_list_pupilCreateManyPupilInputEnvelope";
import { Subcourse_waiting_list_pupilCreateOrConnectWithoutPupilInput } from "../inputs/Subcourse_waiting_list_pupilCreateOrConnectWithoutPupilInput";
import { Subcourse_waiting_list_pupilCreateWithoutPupilInput } from "../inputs/Subcourse_waiting_list_pupilCreateWithoutPupilInput";
import { Subcourse_waiting_list_pupilWhereUniqueInput } from "../inputs/Subcourse_waiting_list_pupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_waiting_list_pupilCreateNestedManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilCreateWithoutPupilInput], {
    nullable: true
  })
  create?: Subcourse_waiting_list_pupilCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: Subcourse_waiting_list_pupilCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: Subcourse_waiting_list_pupilCreateManyPupilInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilWhereUniqueInput], {
    nullable: true
  })
  connect?: Subcourse_waiting_list_pupilWhereUniqueInput[] | undefined;
}
