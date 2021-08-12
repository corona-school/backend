import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SubcourseOrderByInput } from "../../../inputs/SubcourseOrderByInput";
import { SubcourseWhereInput } from "../../../inputs/SubcourseWhereInput";
import { SubcourseWhereUniqueInput } from "../../../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateSubcourseArgs {
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
}
