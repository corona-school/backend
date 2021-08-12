import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Jufo_verification_transmissionCreateManyInput } from "../../../inputs/Jufo_verification_transmissionCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyJufo_verification_transmissionArgs {
  @TypeGraphQL.Field(_type => [Jufo_verification_transmissionCreateManyInput], {
    nullable: false
  })
  data!: Jufo_verification_transmissionCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
