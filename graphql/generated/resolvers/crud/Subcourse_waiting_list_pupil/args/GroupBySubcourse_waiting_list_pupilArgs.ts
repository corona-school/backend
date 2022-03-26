import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_waiting_list_pupilOrderByInput } from "../../../inputs/Subcourse_waiting_list_pupilOrderByInput";
import { Subcourse_waiting_list_pupilScalarWhereWithAggregatesInput } from "../../../inputs/Subcourse_waiting_list_pupilScalarWhereWithAggregatesInput";
import { Subcourse_waiting_list_pupilWhereInput } from "../../../inputs/Subcourse_waiting_list_pupilWhereInput";
import { Subcourse_waiting_list_pupilScalarFieldEnum } from "../../../../enums/Subcourse_waiting_list_pupilScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupBySubcourse_waiting_list_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereInput, {
    nullable: true
  })
  where?: Subcourse_waiting_list_pupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilOrderByInput], {
    nullable: true
  })
  orderBy?: Subcourse_waiting_list_pupilOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"subcourseId" | "pupilId">;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Subcourse_waiting_list_pupilScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
