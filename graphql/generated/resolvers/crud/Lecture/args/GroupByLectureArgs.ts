import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LectureOrderByWithAggregationInput } from "../../../inputs/LectureOrderByWithAggregationInput";
import { LectureScalarWhereWithAggregatesInput } from "../../../inputs/LectureScalarWhereWithAggregatesInput";
import { LectureWhereInput } from "../../../inputs/LectureWhereInput";
import { LectureScalarFieldEnum } from "../../../../enums/LectureScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByLectureArgs {
  @TypeGraphQL.Field(_type => LectureWhereInput, {
    nullable: true
  })
  where?: LectureWhereInput | undefined;

  @TypeGraphQL.Field(_type => [LectureOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: LectureOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "start" | "duration" | "instructorId" | "subcourseId">;

  @TypeGraphQL.Field(_type => LectureScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: LectureScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
