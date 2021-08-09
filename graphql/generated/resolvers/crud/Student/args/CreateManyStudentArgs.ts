import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { StudentCreateManyInput } from "../../../inputs/StudentCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyStudentArgs {
  @TypeGraphQL.Field(_type => [StudentCreateManyInput], {
    nullable: false
  })
  data!: StudentCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
