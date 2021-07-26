import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SubcourseOrderByInput } from "../../../inputs/SubcourseOrderByInput";
import { SubcourseScalarWhereWithAggregatesInput } from "../../../inputs/SubcourseScalarWhereWithAggregatesInput";
import { SubcourseWhereInput } from "../../../inputs/SubcourseWhereInput";
import { SubcourseScalarFieldEnum } from "../../../../enums/SubcourseScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupBySubcourseArgs {
  @TypeGraphQL.Field(_type => SubcourseWhereInput, {
    nullable: true
  })
  where?: SubcourseWhereInput | undefined;

  @TypeGraphQL.Field(_type => [SubcourseOrderByInput], {
    nullable: true
  })
  orderBy?: SubcourseOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [SubcourseScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "minGrade" | "maxGrade" | "maxParticipants" | "published" | "cancelled" | "joinAfterStart" | "courseId">;

  @TypeGraphQL.Field(_type => SubcourseScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: SubcourseScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
