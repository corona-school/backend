import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Certificate_of_conductOrderByInput } from "../../../inputs/Certificate_of_conductOrderByInput";
import { Certificate_of_conductScalarWhereWithAggregatesInput } from "../../../inputs/Certificate_of_conductScalarWhereWithAggregatesInput";
import { Certificate_of_conductWhereInput } from "../../../inputs/Certificate_of_conductWhereInput";
import { Certificate_of_conductScalarFieldEnum } from "../../../../enums/Certificate_of_conductScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByCertificate_of_conductArgs {
  @TypeGraphQL.Field(_type => Certificate_of_conductWhereInput, {
    nullable: true
  })
  where?: Certificate_of_conductWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductOrderByInput], {
    nullable: true
  })
  orderBy?: Certificate_of_conductOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "dateOfInspection" | "dateOfIssue" | "criminalRecords" | "inspectingScreenerId" | "studentId">;

  @TypeGraphQL.Field(_type => Certificate_of_conductScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Certificate_of_conductScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
