// eslint-disable-next-line camelcase
import {Certificate_of_conduct, Course, Screener, Student} from "../generated";
import { Authorized, FieldResolver, Resolver, Root } from "type-graphql";
import { prisma } from "../../common/prisma";
import { Role } from "../authorizations";


// eslint-disable-next-line camelcase
@Resolver(of => Certificate_of_conduct)
export class ExtendedFieldsCertificateOfConductResolver {
    // eslint-disable-next-line camelcase
    @FieldResolver(returns => [Screener])
    @Authorized(Role.ADMIN)
    // eslint-disable-next-line camelcase
    async certificate(@Root() certificate: Certificate_of_conduct) {
        return await prisma.screener.findMany({
            where: {
                id: certificate.inspectingScreenerId
            }
        });
    }

    @FieldResolver(returns => [Student])
    @Authorized(Role.ADMIN)
    // eslint-disable-next-line camelcase
    async student(@Root() certificate: Certificate_of_conduct) {
        return await prisma.student.findMany({
            where: {
                id: certificate.studentId
            }
        });
    }
}