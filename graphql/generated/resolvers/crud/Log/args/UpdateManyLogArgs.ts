import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { LogUpdateManyMutationInput } from "../../../inputs/LogUpdateManyMutationInput";
import { LogWhereInput } from "../../../inputs/LogWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyLogArgs {
  @TypeGraphQL.Field(_type => LogUpdateManyMutationInput, {
    nullable: false
  })
  data!: LogUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => LogWhereInput, {
    nullable: true
  })
  where?: LogWhereInput | undefined;
}
