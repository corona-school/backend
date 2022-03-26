import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntFilter } from "../inputs/IntFilter";

@TypeGraphQL.InputType("Subcourse_participants_pupilScalarWhereInput", {
  isAbstract: true
})
export class Subcourse_participants_pupilScalarWhereInput {
  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilScalarWhereInput], {
    nullable: true
  })
  AND?: Subcourse_participants_pupilScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilScalarWhereInput], {
    nullable: true
  })
  OR?: Subcourse_participants_pupilScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilScalarWhereInput], {
    nullable: true
  })
  NOT?: Subcourse_participants_pupilScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  subcourseId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  pupilId?: IntFilter | undefined;
}
