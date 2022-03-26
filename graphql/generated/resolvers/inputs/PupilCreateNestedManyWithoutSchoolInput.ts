import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateManySchoolInputEnvelope } from "../inputs/PupilCreateManySchoolInputEnvelope";
import { PupilCreateOrConnectWithoutSchoolInput } from "../inputs/PupilCreateOrConnectWithoutSchoolInput";
import { PupilCreateWithoutSchoolInput } from "../inputs/PupilCreateWithoutSchoolInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilCreateNestedManyWithoutSchoolInput", {
  isAbstract: true
})
export class PupilCreateNestedManyWithoutSchoolInput {
  @TypeGraphQL.Field(_type => [PupilCreateWithoutSchoolInput], {
    nullable: true
  })
  create?: PupilCreateWithoutSchoolInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilCreateOrConnectWithoutSchoolInput], {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutSchoolInput[] | undefined;

  @TypeGraphQL.Field(_type => PupilCreateManySchoolInputEnvelope, {
    nullable: true
  })
  createMany?: PupilCreateManySchoolInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [PupilWhereUniqueInput], {
    nullable: true
  })
  connect?: PupilWhereUniqueInput[] | undefined;
}
