import { Achievement_template } from '../../graphql/generated';

export function sortActionTemplatesToGroups(templatesForAction: Achievement_template[]) {
    const templatesByGroups: Map<string, Achievement_template[]> = new Map();
    for (const template of templatesForAction) {
        if (!templatesByGroups.has(template.group)) {
            templatesByGroups.set(template.group, []);
        }
        templatesByGroups.get(template.group).push(template);
    }
    templatesByGroups.forEach((group, key) => {
        group.sort((a, b) => a.groupOrder - b.groupOrder);
        templatesByGroups.set(key, group);
    });
    return templatesByGroups;
}

// replace recordValue in condition with number of last record
export function injectRecordValue(condition: string, recordValue: number) {
    if (typeof recordValue === 'number') {
        return condition.replace('recordValue', recordValue.toString());
    }
    return condition;
}
