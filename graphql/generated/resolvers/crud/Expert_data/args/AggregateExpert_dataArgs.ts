import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_dataOrderByInput } from "../../../inputs/Expert_dataOrderByInput";
import { Expert_dataWhereInput } from "../../../inputs/Expert_dataWhereInput";
import { Expert_dataWhereUniqueInput } from "../../../inputs/Expert_dataWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateExpert_dataArgs {
  @TypeGraphQL.Field(_type => Expert_dataWhereInput, {
    nullable: true
  })
  where?: Expert_dataWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Expert_dataOrderByInput], {
    nullable: true
  })
  orderBy?: Expert_dataOrderByInput[] | undefined;

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
