import {getManager} from "typeorm";
import {ExpertData} from "../../common/entity/ExpertData";
import {Student} from "../../common/entity/Student";
import {ExpertiseTag} from "../../common/entity/ExpertiseTag";

const entityManager = getManager();


export async function getExperts() {
    return entityManager
        .createQueryBuilder(ExpertData, "e")
        .leftJoinAndSelect("e.student", "s")
        .leftJoinAndSelect("e.expertiseTags", "t")
        .where("e.active AND e.allowed='yes'")
        .getMany();
}


export async function getExpertByStudent(condition: { student: Student }) {
    let expertData = await entityManager.findOne(ExpertData, condition);

    if (!expertData) {
        expertData = new ExpertData();
        expertData.student = condition.student;
    }

    return expertData;
}

export async function getExpertById(condition: {id: number}) {
    return entityManager.findOne(ExpertData, condition);
}

export async function saveExpertData(expertData: ExpertData) {
    return entityManager.save(ExpertData, expertData);
}

export async function saveExpertiseTags(expertiseTags: ExpertiseTag[]) {
    return entityManager.save(ExpertiseTag, expertiseTags);
}

export async function getExpertiseTags(options:{relations:string[]}) {
    return entityManager.find(ExpertiseTag, options);
}

export async function GetExpertiseTagEntities(tagNames: string[]): Promise<ExpertiseTag[]> {

    const tags: ExpertiseTag[] = await entityManager.find(ExpertiseTag, { where: tagNames.map(t => ({ name: t }))});

    for (let i = 0; i < tagNames.length; i++) {
        if (!tags.map(t => (t.name)).includes(tagNames[i])) {
            let newTag = new ExpertiseTag();
            newTag.name = tagNames[i];
            tags.push(newTag);
        }
    }

    return tags;
}