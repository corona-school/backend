import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_participants_pupilWhereInput } from "../inputs/Subcourse_participants_pupilWhereInput";

@TypeGraphQL.InputType("Subcourse_participants_pupilListRelationFilter", {
  isAbstract: true
})
export class Subcourse_participants_pupilListRelationFilter {
  @TypeGraphQL.Field(_type => Subcourse_participants_pupilWhereInput, {
    nullable: true
  })
  every?: Subcourse_participants_pupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilWhereInput, {
    nullable: true
  })
  some?: Subcourse_participants_pupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilWhereInput, {
    nullable: true
  })
  none?: Subcourse_participants_pupilWhereInput | undefined;
}
