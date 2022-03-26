import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_coaching_screeningWhereInput } from "../inputs/Project_coaching_screeningWhereInput";

@TypeGraphQL.InputType("Project_coaching_screeningListRelationFilter", {
  isAbstract: true
})
export class Project_coaching_screeningListRelationFilter {
  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereInput, {
    nullable: true
  })
  every?: Project_coaching_screeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereInput, {
    nullable: true
  })
  some?: Project_coaching_screeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereInput, {
    nullable: true
  })
  none?: Project_coaching_screeningWhereInput | undefined;
}
