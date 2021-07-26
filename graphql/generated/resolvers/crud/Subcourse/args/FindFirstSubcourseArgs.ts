import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SubcourseOrderByInput } from "../../../inputs/SubcourseOrderByInput";
import { SubcourseWhereInput } from "../../../inputs/SubcourseWhereInput";
import { SubcourseWhereUniqueInput } from "../../../inputs/SubcourseWhereUniqueInput";
import { SubcourseScalarFieldEnum } from "../../../../enums/SubcourseScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstSubcourseArgs {
  @TypeGraphQL.Field(_type => SubcourseWhereInput, {
    nullable: true
  })
  where?: SubcourseWhereInput | undefined;

  @TypeGraphQL.Field(_type => [SubcourseOrderByInput], {
    nullable: true
  })
  orderBy?: SubcourseOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => SubcourseWhereUniqueInput, {
    nullable: true
  })
  cursor?: SubcourseWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [SubcourseScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "updatedAt" | "minGrade" | "maxGrade" | "maxParticipants" | "published" | "cancelled" | "joinAfterStart" | "courseId"> | undefined;
}
