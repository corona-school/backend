// This script is used to take a list of achievemetns and convert them into a seed file for the database.
// It should be removed after the go live of the feature, as we'll replace it with an import from production.
// The data can be exported from the following spreadsheet
// https://docs.google.com/spreadsheets/d/1VqJEK35C2yiTam2R3wOfYkuKIQh792yDrSqUdRd3i8E/edit#gid=0

const parser = require('csv-parse');
const fs = require('fs');

function parseTemplateFor(templateFor) {
    switch (templateFor) {
        case 'Course':
            return 'achievement_template_for_enum.Course';
        case 'GlobalCourse':
            return 'achievement_template_for_enum.Global_Courses';
        case 'Match':
            return 'achievement_template_for_enum.Match';
        case 'GlobalMatch':
            return 'achievement_template_for_enum.Global_Matches';
        case 'Global':
            return 'achievement_template_for_enum.Global';
        default:
            throw new Error('Unknown templateFor: ' + templateFor);
    }
}

function parseType(type) {
    switch (type) {
        case 'Sequential':
            return 'achievement_type_enum.SEQUENTIAL';
        case 'Streak':
            return 'achievement_type_enum.STREAK';
        case 'Tiered':
            return 'achievement_type_enum.TIERED';
        default:
            throw new Error('Unknown type: ' + type);
    }
}

function parseActionType(actionType) {
    switch (actionType) {
        case 'Appointment':
            return 'achievement_action_type_enum.Appointment';
        case 'Action':
            return 'achievement_action_type_enum.Action';
        case 'Wait':
            return 'achievement_action_type_enum.Wait';
        case 'Info':
            return 'achievement_action_type_enum.Info';
        case 'None':
            return 'null';
        default:
            throw new Error('Unknown actionType: ' + actionType);
    }
}

function escapeString(str) {
    if (str === '' || str === undefined || str === null) {
        return 'null';
    }
    // We had to replace all , with ; to support export to csv from google sheets
    str = str.replaceAll(';', ',');
    return `'${str}'`;
}

const data = fs.readFileSync('./achievements.csv', 'utf8');
parser.parse(data, { delimiter: ',', columns: true }, (_err, records) => {
    const data = records
        .filter((row) => row.group !== '')
        .map(
            (row) => `
await prisma.achievement_template.create({
    data: {
        templateFor: ${parseTemplateFor(row.templateFor)},
        group: '${row.group}',
        groupOrder: ${row.step},
        sequentialStepName: ${escapeString(row.sequentialStepName)},
        type: ${parseType(row.type)},
        title: ${escapeString(row.title)},
        tagline: ${escapeString(row.tagline)},
        subtitle: ${escapeString(row.subtitle)},
        footer: ${escapeString(row.footer)},
        achievedFooter: ${escapeString(row.achievedFooter)},
        description: ${escapeString(row.description)},
        achievedDescription: ${escapeString(row.achievedDescription)},
        image: ${escapeString(row.imageLink)},
        achievedImage: ${escapeString(row.achievedImage)},
        actionName: ${escapeString(row.actionName)},
        actionRedirectLink: ${escapeString(row.linkTo)},
        actionType: ${parseActionType(row.actionType)},
        condition: ${escapeString(row.condition)},
        conditionDataAggregations: JSON.parse('${row.conditionDataAggr.replaceAll(';', ',')}'),
        isActive: true,
    },
});
      `
        );

    const file = `
import { prisma } from './common/prisma';
import { achievement_template_for_enum, achievement_type_enum, achievement_action_type_enum } from '@prisma/client';

export async function importAchievements() {
${data.join('')}
}
  `;

    fs.writeFileSync('../../seed-achievements.ts', file);
});
