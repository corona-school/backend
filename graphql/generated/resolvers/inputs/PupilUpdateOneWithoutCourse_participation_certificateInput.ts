import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutCourse_participation_certificateInput } from "../inputs/PupilCreateOrConnectWithoutCourse_participation_certificateInput";
import { PupilCreateWithoutCourse_participation_certificateInput } from "../inputs/PupilCreateWithoutCourse_participation_certificateInput";
import { PupilUpdateWithoutCourse_participation_certificateInput } from "../inputs/PupilUpdateWithoutCourse_participation_certificateInput";
import { PupilUpsertWithoutCourse_participation_certificateInput } from "../inputs/PupilUpsertWithoutCourse_participation_certificateInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilUpdateOneWithoutCourse_participation_certificateInput", {
  isAbstract: true
})
export class PupilUpdateOneWithoutCourse_participation_certificateInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  create?: PupilCreateWithoutCourse_participation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutCourse_participation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpsertWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  upsert?: PupilUpsertWithoutCourse_participation_certificateInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpdateWithoutCourse_participation_certificateInput, {
    nullable: true
  })
  update?: PupilUpdateWithoutCourse_participation_certificateInput | undefined;
}
