import {getManager} from "typeorm";
import {CourseTag} from "../entity/CourseTag";
import {randomBytes} from "crypto";

export async function createCourseTag(name: string) {
    let identifier = name.toLowerCase().replace(/\s/g, "");
    while (await getManager().findOne(CourseTag, { where: { identifier }})) {
        identifier = name.toLowerCase().replace(/\s/g, "") + randomBytes(1).toString('hex').toLowerCase();
    }

    let tag = new CourseTag();

    tag.identifier = identifier;
    tag.name = name;
    tag.category = 'other'; // Currently we don't know what to do with the category field

    await getManager().save(CourseTag, tag);

    return tag;
}