import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Concrete_notificationOrderByInput } from "../../../inputs/Concrete_notificationOrderByInput";
import { Concrete_notificationScalarWhereWithAggregatesInput } from "../../../inputs/Concrete_notificationScalarWhereWithAggregatesInput";
import { Concrete_notificationWhereInput } from "../../../inputs/Concrete_notificationWhereInput";
import { Concrete_notificationScalarFieldEnum } from "../../../../enums/Concrete_notificationScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByConcrete_notificationArgs {
  @TypeGraphQL.Field(_type => Concrete_notificationWhereInput, {
    nullable: true
  })
  where?: Concrete_notificationWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Concrete_notificationOrderByInput], {
    nullable: true
  })
  orderBy?: Concrete_notificationOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [Concrete_notificationScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "userId" | "notificationID" | "contextID" | "context" | "sentAt" | "state" | "error">;

  @TypeGraphQL.Field(_type => Concrete_notificationScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Concrete_notificationScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
