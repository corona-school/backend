import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expertise_tagOrderByInput } from "../../../inputs/Expertise_tagOrderByInput";
import { Expertise_tagWhereInput } from "../../../inputs/Expertise_tagWhereInput";
import { Expertise_tagWhereUniqueInput } from "../../../inputs/Expertise_tagWhereUniqueInput";
import { Expertise_tagScalarFieldEnum } from "../../../../enums/Expertise_tagScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstExpertise_tagArgs {
  @TypeGraphQL.Field(_type => Expertise_tagWhereInput, {
    nullable: true
  })
  where?: Expertise_tagWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Expertise_tagOrderByInput], {
    nullable: true
  })
  orderBy?: Expertise_tagOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Expertise_tagWhereUniqueInput, {
    nullable: true
  })
  cursor?: Expertise_tagWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Expertise_tagScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "name"> | undefined;
}
