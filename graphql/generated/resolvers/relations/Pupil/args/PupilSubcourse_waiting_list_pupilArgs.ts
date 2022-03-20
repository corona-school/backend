import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_waiting_list_pupilOrderByWithRelationInput } from "../../../inputs/Subcourse_waiting_list_pupilOrderByWithRelationInput";
import { Subcourse_waiting_list_pupilWhereInput } from "../../../inputs/Subcourse_waiting_list_pupilWhereInput";
import { Subcourse_waiting_list_pupilWhereUniqueInput } from "../../../inputs/Subcourse_waiting_list_pupilWhereUniqueInput";
import { Subcourse_waiting_list_pupilScalarFieldEnum } from "../../../../enums/Subcourse_waiting_list_pupilScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class PupilSubcourse_waiting_list_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereInput, {
    nullable: true
  })
  where?: Subcourse_waiting_list_pupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Subcourse_waiting_list_pupilOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereUniqueInput, {
    nullable: true
  })
  cursor?: Subcourse_waiting_list_pupilWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"subcourseId" | "pupilId"> | undefined;
}
