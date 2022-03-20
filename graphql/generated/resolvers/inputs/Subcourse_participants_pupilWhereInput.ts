import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntFilter } from "../inputs/IntFilter";
import { PupilRelationFilter } from "../inputs/PupilRelationFilter";
import { SubcourseRelationFilter } from "../inputs/SubcourseRelationFilter";

@TypeGraphQL.InputType("Subcourse_participants_pupilWhereInput", {
  isAbstract: true
})
export class Subcourse_participants_pupilWhereInput {
  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilWhereInput], {
    nullable: true
  })
  AND?: Subcourse_participants_pupilWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilWhereInput], {
    nullable: true
  })
  OR?: Subcourse_participants_pupilWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilWhereInput], {
    nullable: true
  })
  NOT?: Subcourse_participants_pupilWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  subcourseId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  pupilId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => PupilRelationFilter, {
    nullable: true
  })
  pupil?: PupilRelationFilter | undefined;

  @TypeGraphQL.Field(_type => SubcourseRelationFilter, {
    nullable: true
  })
  subcourse?: SubcourseRelationFilter | undefined;
}
