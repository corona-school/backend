import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateWhereInput } from "../inputs/Participation_certificateWhereInput";

@TypeGraphQL.InputType("Participation_certificateListRelationFilter", {
  isAbstract: true
})
export class Participation_certificateListRelationFilter {
  @TypeGraphQL.Field(_type => Participation_certificateWhereInput, {
    nullable: true
  })
  every?: Participation_certificateWhereInput | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateWhereInput, {
    nullable: true
  })
  some?: Participation_certificateWhereInput | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateWhereInput, {
    nullable: true
  })
  none?: Participation_certificateWhereInput | undefined;
}
