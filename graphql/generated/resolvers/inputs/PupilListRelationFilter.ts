import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilWhereInput } from "../inputs/PupilWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilListRelationFilter {
  @TypeGraphQL.Field(_type => PupilWhereInput, {
    nullable: true
  })
  every?: PupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereInput, {
    nullable: true
  })
  some?: PupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereInput, {
    nullable: true
  })
  none?: PupilWhereInput | undefined;
}
