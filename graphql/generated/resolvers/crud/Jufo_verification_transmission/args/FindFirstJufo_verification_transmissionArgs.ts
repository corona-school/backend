import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Jufo_verification_transmissionOrderByInput } from "../../../inputs/Jufo_verification_transmissionOrderByInput";
import { Jufo_verification_transmissionWhereInput } from "../../../inputs/Jufo_verification_transmissionWhereInput";
import { Jufo_verification_transmissionWhereUniqueInput } from "../../../inputs/Jufo_verification_transmissionWhereUniqueInput";
import { Jufo_verification_transmissionScalarFieldEnum } from "../../../../enums/Jufo_verification_transmissionScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstJufo_verification_transmissionArgs {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereInput, {
    nullable: true
  })
  where?: Jufo_verification_transmissionWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Jufo_verification_transmissionOrderByInput], {
    nullable: true
  })
  orderBy?: Jufo_verification_transmissionOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereUniqueInput, {
    nullable: true
  })
  cursor?: Jufo_verification_transmissionWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Jufo_verification_transmissionScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "uuid" | "studentId"> | undefined;
}
