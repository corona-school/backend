import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_coaching_screeningOrderByWithAggregationInput } from "../../../inputs/Project_coaching_screeningOrderByWithAggregationInput";
import { Project_coaching_screeningScalarWhereWithAggregatesInput } from "../../../inputs/Project_coaching_screeningScalarWhereWithAggregatesInput";
import { Project_coaching_screeningWhereInput } from "../../../inputs/Project_coaching_screeningWhereInput";
import { Project_coaching_screeningScalarFieldEnum } from "../../../../enums/Project_coaching_screeningScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByProject_coaching_screeningArgs {
  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereInput, {
    nullable: true
  })
  where?: Project_coaching_screeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: Project_coaching_screeningOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "success" | "comment" | "knowsCoronaSchoolFrom" | "createdAt" | "updatedAt" | "screenerId" | "studentId">;

  @TypeGraphQL.Field(_type => Project_coaching_screeningScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Project_coaching_screeningScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
