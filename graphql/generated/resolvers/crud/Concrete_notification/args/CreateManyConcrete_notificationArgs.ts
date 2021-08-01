import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Concrete_notificationCreateManyInput } from "../../../inputs/Concrete_notificationCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyConcrete_notificationArgs {
  @TypeGraphQL.Field(_type => [Concrete_notificationCreateManyInput], {
    nullable: false
  })
  data!: Concrete_notificationCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
