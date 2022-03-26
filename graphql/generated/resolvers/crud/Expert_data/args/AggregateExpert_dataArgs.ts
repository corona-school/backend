import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_dataOrderByWithRelationInput } from "../../../inputs/Expert_dataOrderByWithRelationInput";
import { Expert_dataWhereInput } from "../../../inputs/Expert_dataWhereInput";
import { Expert_dataWhereUniqueInput } from "../../../inputs/Expert_dataWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateExpert_dataArgs {
  @TypeGraphQL.Field(_type => Expert_dataWhereInput, {
    nullable: true
  })
  where?: Expert_dataWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Expert_dataOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Expert_dataOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Expert_dataWhereUniqueInput, {
    nullable: true
  })
  cursor?: Expert_dataWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
