import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestWhereInput } from "../inputs/Course_guestWhereInput";

@TypeGraphQL.InputType("Course_guestListRelationFilter", {
  isAbstract: true
})
export class Course_guestListRelationFilter {
  @TypeGraphQL.Field(_type => Course_guestWhereInput, {
    nullable: true
  })
  every?: Course_guestWhereInput | undefined;

  @TypeGraphQL.Field(_type => Course_guestWhereInput, {
    nullable: true
  })
  some?: Course_guestWhereInput | undefined;

  @TypeGraphQL.Field(_type => Course_guestWhereInput, {
    nullable: true
  })
  none?: Course_guestWhereInput | undefined;
}
