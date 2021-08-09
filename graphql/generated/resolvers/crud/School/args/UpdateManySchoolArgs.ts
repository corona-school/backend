import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SchoolUpdateManyMutationInput } from "../../../inputs/SchoolUpdateManyMutationInput";
import { SchoolWhereInput } from "../../../inputs/SchoolWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManySchoolArgs {
  @TypeGraphQL.Field(_type => SchoolUpdateManyMutationInput, {
    nullable: false
  })
  data!: SchoolUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => SchoolWhereInput, {
    nullable: true
  })
  where?: SchoolWhereInput | undefined;
}
