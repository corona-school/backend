import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateManySchoolInput } from "../inputs/PupilCreateManySchoolInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilCreateManySchoolInputEnvelope {
  @TypeGraphQL.Field(_type => [PupilCreateManySchoolInput], {
    nullable: false
  })
  data!: PupilCreateManySchoolInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
