import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { DeleteExpert_dataArgs } from "./args/DeleteExpert_dataArgs";
import { Expert_data } from "../../../models/Expert_data";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expert_data)
export class DeleteExpert_dataResolver {
  @TypeGraphQL.Mutation(_returns => Expert_data, {
    nullable: true
  })
  async deleteExpert_data(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteExpert_dataArgs): Promise<Expert_data | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
