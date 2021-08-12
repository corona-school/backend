import {Pupil} from "../../../common/entity/Pupil";
import {Student} from "../../../common/entity/Student";
import {ApiContactExpert} from "./format";
import {getTransactionLog} from "../../../common/transactionlog";
import {getExpertById} from "../../datastore/dataModel";
import mailjet from "../../../common/mails/mailjet";
import {DEFAULTSENDERS} from "../../../common/mails/config";
import ContactExpertEvent from "../../../common/transactionlog/types/ContactExpertEvent";
import {logger} from "sequelize/types/lib/utils/logger";

export async function postContactExpert(id: string, user: Pupil | Student, apiContactExpert: ApiContactExpert): Promise<number> {
    const transactionLog = getTransactionLog();
    const expert = await getExpertById({id: Number(id)});
    if (expert === undefined) {
        logger.warn(`Expert with ID ${id} does not exist.`);
        return 404;
    }
    const receiverAddress = expert.contactEmail;
    const receiverName = `${expert.student.firstname} ${expert.student.lastname}`;
    const replyToAddress = user.email;
    const replyToName = `${user.firstname} ${user.lastname}`;

    await mailjet.sendPure(
        apiContactExpert.subject ?? "",
        apiContactExpert.emailText,
        DEFAULTSENDERS.noreply,
        receiverAddress,
        replyToName,
        receiverName,
        replyToAddress,
        replyToName
    );

    await transactionLog.log(new ContactExpertEvent(user, apiContactExpert));

    return 200;
}