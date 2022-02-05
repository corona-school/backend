import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreeningOrderByInput } from "../../../inputs/ScreeningOrderByInput";
import { ScreeningWhereInput } from "../../../inputs/ScreeningWhereInput";
import { ScreeningWhereUniqueInput } from "../../../inputs/ScreeningWhereUniqueInput";
import { ScreeningScalarFieldEnum } from "../../../../enums/ScreeningScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class ScreenerScreeningsArgs {
  @TypeGraphQL.Field(_type => ScreeningWhereInput, {
    nullable: true
  })
  where?: ScreeningWhereInput | undefined;

  @TypeGraphQL.Field(_type => [ScreeningOrderByInput], {
    nullable: true
  })
  orderBy?: ScreeningOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => ScreeningWhereUniqueInput, {
    nullable: true
  })
  cursor?: ScreeningWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [ScreeningScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "success" | "comment" | "knowsCoronaSchoolFrom" | "createdAt" | "updatedAt" | "screenerId" | "studentId"> | undefined;
}
