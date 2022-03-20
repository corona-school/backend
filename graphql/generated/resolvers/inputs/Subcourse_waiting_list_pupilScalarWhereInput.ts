import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntFilter } from "../inputs/IntFilter";

@TypeGraphQL.InputType("Subcourse_waiting_list_pupilScalarWhereInput", {
  isAbstract: true
})
export class Subcourse_waiting_list_pupilScalarWhereInput {
  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilScalarWhereInput], {
    nullable: true
  })
  AND?: Subcourse_waiting_list_pupilScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilScalarWhereInput], {
    nullable: true
  })
  OR?: Subcourse_waiting_list_pupilScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilScalarWhereInput], {
    nullable: true
  })
  NOT?: Subcourse_waiting_list_pupilScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  subcourseId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  pupilId?: IntFilter | undefined;
}
