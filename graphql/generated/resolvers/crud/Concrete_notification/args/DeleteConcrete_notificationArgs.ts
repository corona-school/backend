import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Concrete_notificationWhereUniqueInput } from "../../../inputs/Concrete_notificationWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteConcrete_notificationArgs {
  @TypeGraphQL.Field(_type => Concrete_notificationWhereUniqueInput, {
    nullable: false
  })
  where!: Concrete_notificationWhereUniqueInput;
}
