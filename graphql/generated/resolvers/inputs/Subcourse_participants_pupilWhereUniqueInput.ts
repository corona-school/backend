import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { subcourse_participants_pupilSubcourseIdPupilIdCompoundUniqueInput } from "../inputs/subcourse_participants_pupilSubcourseIdPupilIdCompoundUniqueInput";

@TypeGraphQL.InputType("Subcourse_participants_pupilWhereUniqueInput", {
  isAbstract: true
})
export class Subcourse_participants_pupilWhereUniqueInput {
  @TypeGraphQL.Field(_type => subcourse_participants_pupilSubcourseIdPupilIdCompoundUniqueInput, {
    nullable: true
  })
  subcourseId_pupilId?: subcourse_participants_pupilSubcourseIdPupilIdCompoundUniqueInput | undefined;
}
