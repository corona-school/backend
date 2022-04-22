import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateWhereInput } from "../inputs/Course_participation_certificateWhereInput";

@TypeGraphQL.InputType("Course_participation_certificateListRelationFilter", {
  isAbstract: true
})
export class Course_participation_certificateListRelationFilter {
  @TypeGraphQL.Field(_type => Course_participation_certificateWhereInput, {
    nullable: true
  })
  every?: Course_participation_certificateWhereInput | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateWhereInput, {
    nullable: true
  })
  some?: Course_participation_certificateWhereInput | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateWhereInput, {
    nullable: true
  })
  none?: Course_participation_certificateWhereInput | undefined;
}
