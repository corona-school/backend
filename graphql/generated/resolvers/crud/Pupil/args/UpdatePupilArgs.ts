import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { PupilUpdateInput } from "../../../inputs/PupilUpdateInput";
import { PupilWhereUniqueInput } from "../../../inputs/PupilWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdatePupilArgs {
  @TypeGraphQL.Field(_type => PupilUpdateInput, {
    nullable: false
  })
  data!: PupilUpdateInput;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;
}
