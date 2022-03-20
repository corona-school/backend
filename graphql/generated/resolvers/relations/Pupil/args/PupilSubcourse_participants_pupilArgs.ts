import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_participants_pupilOrderByWithRelationInput } from "../../../inputs/Subcourse_participants_pupilOrderByWithRelationInput";
import { Subcourse_participants_pupilWhereInput } from "../../../inputs/Subcourse_participants_pupilWhereInput";
import { Subcourse_participants_pupilWhereUniqueInput } from "../../../inputs/Subcourse_participants_pupilWhereUniqueInput";
import { Subcourse_participants_pupilScalarFieldEnum } from "../../../../enums/Subcourse_participants_pupilScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class PupilSubcourse_participants_pupilArgs {
  @TypeGraphQL.Field(_type => Subcourse_participants_pupilWhereInput, {
    nullable: true
  })
  where?: Subcourse_participants_pupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Subcourse_participants_pupilOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilWhereUniqueInput, {
    nullable: true
  })
  cursor?: Subcourse_participants_pupilWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"subcourseId" | "pupilId"> | undefined;
}
