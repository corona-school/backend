import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateNestedOneWithoutCertificate_of_conductInput } from "../inputs/ScreenerCreateNestedOneWithoutCertificate_of_conductInput";
import { StudentCreateNestedOneWithoutCertificate_of_conductInput } from "../inputs/StudentCreateNestedOneWithoutCertificate_of_conductInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Certificate_of_conductCreateInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  dateOfInspection!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  dateOfIssue!: Date;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  criminalRecords!: boolean;

  @TypeGraphQL.Field(_type => ScreenerCreateNestedOneWithoutCertificate_of_conductInput, {
    nullable: true
  })
  inspectingScreener?: ScreenerCreateNestedOneWithoutCertificate_of_conductInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutCertificate_of_conductInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutCertificate_of_conductInput | undefined;
}
