import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreeningOrderByInput } from "../../../inputs/ScreeningOrderByInput";
import { ScreeningScalarWhereWithAggregatesInput } from "../../../inputs/ScreeningScalarWhereWithAggregatesInput";
import { ScreeningWhereInput } from "../../../inputs/ScreeningWhereInput";
import { ScreeningScalarFieldEnum } from "../../../../enums/ScreeningScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByScreeningArgs {
  @TypeGraphQL.Field(_type => ScreeningWhereInput, {
    nullable: true
  })
  where?: ScreeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => [ScreeningOrderByInput], {
    nullable: true
  })
  orderBy?: ScreeningOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreeningScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "success" | "comment" | "knowsCoronaSchoolFrom" | "createdAt" | "updatedAt" | "screenerId" | "studentId">;

  @TypeGraphQL.Field(_type => ScreeningScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: ScreeningScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
