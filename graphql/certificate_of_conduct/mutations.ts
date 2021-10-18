import {Arg, Authorized, Mutation, Resolver} from "type-graphql";
import * as GraphQLModel from "../generated/models";
import {Role} from "../authorizations";
// eslint-disable-next-line camelcase
import {Certificate_of_conductCreateInput} from "../generated";
import {deactivateStudent} from "../../common/student/activation";
import {getStudent} from "../util";
import * as CertificateOfConduct from "../../common/certificate-of-conduct/certificateOfConduct";

@Resolver(of => GraphQLModel.Certificate_of_conduct)
export class MutateCertificateOfConductResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    // eslint-disable-next-line camelcase
    async updateCertificate(@Arg("studentId") studentId: number, @Arg("criminalRecord") criminalRecord:boolean) {
        const student = await getStudent(studentId);
        if (criminalRecord) {
            await deactivateStudent(student);
        }
        return true;
    }


    @Mutation(returns => Boolean)
    @Authorized(Role.ADMIN)
    // eslint-disable-next-line camelcase
    async createCertificate(
        @Arg("dateOfInspection") dateOfInspection: Date,
        @Arg("dateOfIssue") dateOfIssue: Date,
        @Arg("criminalRecords") criminalRecords: boolean,
        @Arg("inspectingScreenerId") inspectingScreenerId: number,
        @Arg("studentId") studentId: number) {
        await CertificateOfConduct.create(dateOfInspection, dateOfIssue, criminalRecords, inspectingScreenerId, studentId);
        return true;
    }

}