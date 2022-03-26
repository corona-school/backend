import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchCreateManyPupilInput } from "../inputs/MatchCreateManyPupilInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MatchCreateManyPupilInputEnvelope {
  @TypeGraphQL.Field(_type => [MatchCreateManyPupilInput], {
    nullable: false
  })
  data!: MatchCreateManyPupilInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
