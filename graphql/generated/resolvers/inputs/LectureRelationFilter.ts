import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureWhereInput } from "../inputs/LectureWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureRelationFilter {
  @TypeGraphQL.Field(_type => LectureWhereInput, {
    nullable: true
  })
  is?: LectureWhereInput | undefined;

  @TypeGraphQL.Field(_type => LectureWhereInput, {
    nullable: true
  })
  isNot?: LectureWhereInput | undefined;
}
