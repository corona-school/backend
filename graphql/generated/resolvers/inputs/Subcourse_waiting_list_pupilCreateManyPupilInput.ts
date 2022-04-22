import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("Subcourse_waiting_list_pupilCreateManyPupilInput", {
  isAbstract: true
})
export class Subcourse_waiting_list_pupilCreateManyPupilInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  subcourseId!: number;
}
