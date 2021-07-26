import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MigrationsOrderByInput } from "../../../inputs/MigrationsOrderByInput";
import { MigrationsWhereInput } from "../../../inputs/MigrationsWhereInput";
import { MigrationsWhereUniqueInput } from "../../../inputs/MigrationsWhereUniqueInput";
import { MigrationsScalarFieldEnum } from "../../../../enums/MigrationsScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstMigrationsArgs {
  @TypeGraphQL.Field(_type => MigrationsWhereInput, {
    nullable: true
  })
  where?: MigrationsWhereInput | undefined;

  @TypeGraphQL.Field(_type => [MigrationsOrderByInput], {
    nullable: true
  })
  orderBy?: MigrationsOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => MigrationsWhereUniqueInput, {
    nullable: true
  })
  cursor?: MigrationsWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [MigrationsScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "timestamp" | "name"> | undefined;
}
