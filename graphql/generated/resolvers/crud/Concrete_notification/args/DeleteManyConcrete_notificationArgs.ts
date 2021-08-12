import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Concrete_notificationWhereInput } from "../../../inputs/Concrete_notificationWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyConcrete_notificationArgs {
  @TypeGraphQL.Field(_type => Concrete_notificationWhereInput, {
    nullable: true
  })
  where?: Concrete_notificationWhereInput | undefined;
}
