import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_participants_pupilCreateManyPupilInput } from "../inputs/Subcourse_participants_pupilCreateManyPupilInput";

@TypeGraphQL.InputType("Subcourse_participants_pupilCreateManyPupilInputEnvelope", {
  isAbstract: true
})
export class Subcourse_participants_pupilCreateManyPupilInputEnvelope {
  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilCreateManyPupilInput], {
    nullable: false
  })
  data!: Subcourse_participants_pupilCreateManyPupilInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
