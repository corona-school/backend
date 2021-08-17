import * as TypeGraphQL from "type-graphql";
import { Jufo_verification_transmission } from "../../../models/Jufo_verification_transmission";
import { Student } from "../../../models/Student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Jufo_verification_transmission)
export class Jufo_verification_transmissionRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Student, {
    nullable: true
  })
  async student(@TypeGraphQL.Root() jufo_verification_transmission: Jufo_verification_transmission, @TypeGraphQL.Ctx() ctx: any): Promise<Student | null> {
    return getPrismaFromContext(ctx).jufo_verification_transmission.findUnique({
      where: {
        id: jufo_verification_transmission.id,
      },
    }).student({});
  }
}
