import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateCreateManyPupilInput } from "../inputs/Participation_certificateCreateManyPupilInput";

@TypeGraphQL.InputType("Participation_certificateCreateManyPupilInputEnvelope", {
  isAbstract: true
})
export class Participation_certificateCreateManyPupilInputEnvelope {
  @TypeGraphQL.Field(_type => [Participation_certificateCreateManyPupilInput], {
    nullable: false
  })
  data!: Participation_certificateCreateManyPupilInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
