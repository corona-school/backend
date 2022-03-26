import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutCourse_participation_certificateInput } from "../inputs/PupilCreateWithoutCourse_participation_certificateInput";
import { PupilUpdateWithoutCourse_participation_certificateInput } from "../inputs/PupilUpdateWithoutCourse_participation_certificateInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilUpsertWithoutCourse_participation_certificateInput {
  @TypeGraphQL.Field(_type => PupilUpdateWithoutCourse_participation_certificateInput, {
    nullable: false
  })
  update!: PupilUpdateWithoutCourse_participation_certificateInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutCourse_participation_certificateInput, {
    nullable: false
  })
  create!: PupilCreateWithoutCourse_participation_certificateInput;
}
