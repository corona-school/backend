import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_participants_pupilUpdateManyMutationInput } from "../../../inputs/Subcourse_participants_pupilUpdateManyMutationInput";
import { Subcourse_participants_pupilWhereInput } from "../../../inputs/Subcourse_participants_pupilWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManySubcourse_participants_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_participants_pupilUpdateManyMutationInput, {
    nullable: false
  })
  data!: Subcourse_participants_pupilUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilWhereInput, {
    nullable: true
  })
  where?: Subcourse_participants_pupilWhereInput | undefined;
}
