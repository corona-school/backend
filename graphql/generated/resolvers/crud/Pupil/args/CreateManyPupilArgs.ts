import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { PupilCreateManyInput } from "../../../inputs/PupilCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyPupilArgs {
  @TypeGraphQL.Field(_type => [PupilCreateManyInput], {
    nullable: false
  })
  data!: PupilCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
