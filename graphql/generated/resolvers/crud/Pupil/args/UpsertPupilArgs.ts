import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { PupilCreateInput } from "../../../inputs/PupilCreateInput";
import { PupilUpdateInput } from "../../../inputs/PupilUpdateInput";
import { PupilWhereUniqueInput } from "../../../inputs/PupilWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertPupilArgs {
  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => PupilCreateInput, {
    nullable: false
  })
  create!: PupilCreateInput;

  @TypeGraphQL.Field(_type => PupilUpdateInput, {
    nullable: false
  })
  update!: PupilUpdateInput;
}
