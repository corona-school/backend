import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { subcourse_waiting_list_pupilSubcourseIdPupilIdCompoundUniqueInput } from "../inputs/subcourse_waiting_list_pupilSubcourseIdPupilIdCompoundUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_waiting_list_pupilWhereUniqueInput {
  @TypeGraphQL.Field(_type => subcourse_waiting_list_pupilSubcourseIdPupilIdCompoundUniqueInput, {
    nullable: true
  })
  subcourseId_pupilId?: subcourse_waiting_list_pupilSubcourseIdPupilIdCompoundUniqueInput | undefined;
}
