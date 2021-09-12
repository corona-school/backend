import {Pupil} from "../../../common/entity/Pupil";
import {Student} from "../../../common/entity/Student";
import {ApiContactExpert, ApiGetExpert, ApiGetExpertiseTag, ApiPutExpert} from "./format";
import {getTransactionLog} from "../../../common/transactionlog";
import {getExpertById, getExpertByStudent, GetExpertiseTagEntities, saveExpertData, saveExpertiseTags} from "../../datastore/dataModel";
import mailjet from "../../../common/mails/mailjet";
import {DEFAULTSENDERS} from "../../../common/mails/config";
import ContactExpertEvent from "../../../common/transactionlog/types/ContactExpertEvent";
import {ExpertData} from "../../../common/entity/ExpertData";
import {ExpertiseTag} from "../../../common/entity/ExpertiseTag";
import {ExpertAllowedIndication} from "../../../common/jufo/expertAllowedIndication";
import {getLogger} from "log4js";
const logger = getLogger();

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

export async function transformAPIExpertData(experts: ExpertData[]) {
    let apiGetExperts: ApiGetExpert[] = [];
    for (const expert of experts) {
        const expertiseTags = expert.expertiseTags?.map(t => (t.name)) || [];
        const projectFields = await expert.student.getProjectFields().then((res) => res.map(f => f.name));
        let apiExpert = new ApiGetExpert(expert.id, expert.student.firstname, expert.student.lastname, expert.description, expertiseTags, projectFields);
        apiGetExperts.push(apiExpert);
    }
    return apiGetExperts;
}


export async function transformAPIExpertiseTags(tags) {
    const apiResponse: ApiGetExpertiseTag[] = [];
    for (const tag of tags) {
        let apiTag: ApiGetExpertiseTag = {
            name: tag.name,
            experts: tag.expertData.map(e => e.id)
        };
        apiResponse.push(apiTag);
    }
    return apiResponse;
}

export async function putExpert(wixId: string, student: Student, info: ApiPutExpert): Promise<number> {
    if (wixId != student.wix_id) {
        logger.warn(`Person with id ${student.wix_id} tried to access data from id ${wixId}`);
        return 403;
    }

    if (!student.isProjectCoach) {
        logger.warn("Non-project-coach tried to put expert data.");
        return 403;
    }

    const expertiseTags: ExpertiseTag[] = await GetExpertiseTagEntities(info.expertiseTags);

    let expertData = await getExpertByStudent({student: student});

    expertData.contactEmail = info.contactEmail ?? student.email;
    expertData.description = info.description;
    expertData.expertiseTags = expertiseTags;
    expertData.active = info.active;
    expertData.allowed = ExpertAllowedIndication.PENDING;

    try {
        await saveExpertiseTags(expertiseTags);
        await saveExpertData(expertData);
    } catch (e) {
        logger.error("Failed to save expert data with: ", e.message);
        return 500;
    }
    return 204;
}

