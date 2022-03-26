import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutCourse_participation_certificateInput } from "../inputs/PupilCreateWithoutCourse_participation_certificateInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilCreateOrConnectWithoutCourse_participation_certificateInput", {
  isAbstract: true
})
export class PupilCreateOrConnectWithoutCourse_participation_certificateInput {
  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutCourse_participation_certificateInput, {
    nullable: false
  })
  create!: PupilCreateWithoutCourse_participation_certificateInput;
}
