import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { IntFilter } from "../inputs/IntFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagScalarWhereInput {
  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagScalarWhereInput], {
    nullable: true
  })
  AND?: Expert_data_expertise_tags_expertise_tagScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagScalarWhereInput], {
    nullable: true
  })
  OR?: Expert_data_expertise_tags_expertise_tagScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_data_expertise_tags_expertise_tagScalarWhereInput], {
    nullable: true
  })
  NOT?: Expert_data_expertise_tags_expertise_tagScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  expertDataId?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  expertiseTagId?: IntFilter | undefined;
}
