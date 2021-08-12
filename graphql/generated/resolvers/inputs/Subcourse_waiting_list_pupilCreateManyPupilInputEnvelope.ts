import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilCreateManyPupilInput } from "../inputs/Subcourse_waiting_list_pupilCreateManyPupilInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_waiting_list_pupilCreateManyPupilInputEnvelope {
  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilCreateManyPupilInput], {
    nullable: false
  })
  data!: Subcourse_waiting_list_pupilCreateManyPupilInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
