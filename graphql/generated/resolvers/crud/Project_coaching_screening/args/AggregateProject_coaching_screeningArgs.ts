import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_coaching_screeningOrderByInput } from "../../../inputs/Project_coaching_screeningOrderByInput";
import { Project_coaching_screeningWhereInput } from "../../../inputs/Project_coaching_screeningWhereInput";
import { Project_coaching_screeningWhereUniqueInput } from "../../../inputs/Project_coaching_screeningWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateProject_coaching_screeningArgs {
  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereInput, {
    nullable: true
  })
  where?: Project_coaching_screeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningOrderByInput], {
    nullable: true
  })
  orderBy?: Project_coaching_screeningOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningWhereUniqueInput, {
    nullable: true
  })
  cursor?: Project_coaching_screeningWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
