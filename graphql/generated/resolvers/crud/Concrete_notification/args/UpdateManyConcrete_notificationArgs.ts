import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Concrete_notificationUpdateManyMutationInput } from "../../../inputs/Concrete_notificationUpdateManyMutationInput";
import { Concrete_notificationWhereInput } from "../../../inputs/Concrete_notificationWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyConcrete_notificationArgs {
  @TypeGraphQL.Field(_type => Concrete_notificationUpdateManyMutationInput, {
    nullable: false
  })
  data!: Concrete_notificationUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Concrete_notificationWhereInput, {
    nullable: true
  })
  where?: Concrete_notificationWhereInput | undefined;
}
