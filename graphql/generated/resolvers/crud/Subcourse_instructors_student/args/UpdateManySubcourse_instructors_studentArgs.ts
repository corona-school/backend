import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Subcourse_instructors_studentUpdateManyMutationInput } from "../../../inputs/Subcourse_instructors_studentUpdateManyMutationInput";
import { Subcourse_instructors_studentWhereInput } from "../../../inputs/Subcourse_instructors_studentWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManySubcourse_instructors_studentArgs {
  @TypeGraphQL.Field(_type => Subcourse_instructors_studentUpdateManyMutationInput, {
    nullable: false
  })
  data!: Subcourse_instructors_studentUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentWhereInput, {
    nullable: true
  })
  where?: Subcourse_instructors_studentWhereInput | undefined;
}
