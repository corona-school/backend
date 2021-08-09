import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Concrete_notificationCreateInput } from "../../../inputs/Concrete_notificationCreateInput";

@TypeGraphQL.ArgsType()
export class CreateConcrete_notificationArgs {
  @TypeGraphQL.Field(_type => Concrete_notificationCreateInput, {
    nullable: false
  })
  data!: Concrete_notificationCreateInput;
}
