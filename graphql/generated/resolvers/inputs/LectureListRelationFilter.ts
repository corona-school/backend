import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureWhereInput } from "../inputs/LectureWhereInput";

@TypeGraphQL.InputType("LectureListRelationFilter", {
  isAbstract: true
})
export class LectureListRelationFilter {
  @TypeGraphQL.Field(_type => LectureWhereInput, {
    nullable: true
  })
  every?: LectureWhereInput | undefined;

  @TypeGraphQL.Field(_type => LectureWhereInput, {
    nullable: true
  })
  some?: LectureWhereInput | undefined;

  @TypeGraphQL.Field(_type => LectureWhereInput, {
    nullable: true
  })
  none?: LectureWhereInput | undefined;
}
