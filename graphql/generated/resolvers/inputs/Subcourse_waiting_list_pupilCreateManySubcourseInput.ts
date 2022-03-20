import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("Subcourse_waiting_list_pupilCreateManySubcourseInput", {
  isAbstract: true
})
export class Subcourse_waiting_list_pupilCreateManySubcourseInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  pupilId!: number;
}
