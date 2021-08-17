import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { PupilUpdateManyMutationInput } from "../../../inputs/PupilUpdateManyMutationInput";
import { PupilWhereInput } from "../../../inputs/PupilWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyPupilArgs {
  @TypeGraphQL.Field(_type => PupilUpdateManyMutationInput, {
    nullable: false
  })
  data!: PupilUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => PupilWhereInput, {
    nullable: true
  })
  where?: PupilWhereInput | undefined;
}
