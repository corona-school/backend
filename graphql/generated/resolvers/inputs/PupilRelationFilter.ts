import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilWhereInput } from "../inputs/PupilWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilRelationFilter {
  @TypeGraphQL.Field(_type => PupilWhereInput, {
    nullable: true
  })
  is?: PupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereInput, {
    nullable: true
  })
  isNot?: PupilWhereInput | undefined;
}
