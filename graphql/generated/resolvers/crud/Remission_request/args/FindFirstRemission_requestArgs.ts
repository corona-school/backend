import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Remission_requestOrderByInput } from "../../../inputs/Remission_requestOrderByInput";
import { Remission_requestWhereInput } from "../../../inputs/Remission_requestWhereInput";
import { Remission_requestWhereUniqueInput } from "../../../inputs/Remission_requestWhereUniqueInput";
import { Remission_requestScalarFieldEnum } from "../../../../enums/Remission_requestScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstRemission_requestArgs {
  @TypeGraphQL.Field(_type => Remission_requestWhereInput, {
    nullable: true
  })
  where?: Remission_requestWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Remission_requestOrderByInput], {
    nullable: true
  })
  orderBy?: Remission_requestOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Remission_requestWhereUniqueInput, {
    nullable: true
  })
  cursor?: Remission_requestWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Remission_requestScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "updatedAt" | "uuid" | "studentId"> | undefined;
}
