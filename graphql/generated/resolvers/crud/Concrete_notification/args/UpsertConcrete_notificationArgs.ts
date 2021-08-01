import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Concrete_notificationCreateInput } from "../../../inputs/Concrete_notificationCreateInput";
import { Concrete_notificationUpdateInput } from "../../../inputs/Concrete_notificationUpdateInput";
import { Concrete_notificationWhereUniqueInput } from "../../../inputs/Concrete_notificationWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertConcrete_notificationArgs {
  @TypeGraphQL.Field(_type => Concrete_notificationWhereUniqueInput, {
    nullable: false
  })
  where!: Concrete_notificationWhereUniqueInput;

  @TypeGraphQL.Field(_type => Concrete_notificationCreateInput, {
    nullable: false
  })
  create!: Concrete_notificationCreateInput;

  @TypeGraphQL.Field(_type => Concrete_notificationUpdateInput, {
    nullable: false
  })
  update!: Concrete_notificationUpdateInput;
}
