import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilWhereInput } from "../inputs/Subcourse_waiting_list_pupilWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_waiting_list_pupilListRelationFilter {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereInput, {
    nullable: true
  })
  every?: Subcourse_waiting_list_pupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereInput, {
    nullable: true
  })
  some?: Subcourse_waiting_list_pupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereInput, {
    nullable: true
  })
  none?: Subcourse_waiting_list_pupilWhereInput | undefined;
}
