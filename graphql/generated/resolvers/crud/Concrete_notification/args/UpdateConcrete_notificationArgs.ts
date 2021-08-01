import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Concrete_notificationUpdateInput } from "../../../inputs/Concrete_notificationUpdateInput";
import { Concrete_notificationWhereUniqueInput } from "../../../inputs/Concrete_notificationWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateConcrete_notificationArgs {
  @TypeGraphQL.Field(_type => Concrete_notificationUpdateInput, {
    nullable: false
  })
  data!: Concrete_notificationUpdateInput;

  @TypeGraphQL.Field(_type => Concrete_notificationWhereUniqueInput, {
    nullable: false
  })
  where!: Concrete_notificationWhereUniqueInput;
}
