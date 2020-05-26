// This file exports all unmatched and verified students to a format that the matching Algorithm for Corona School expects

import {
    getUnmatchedAndVerifiedStudents,
    getUnmatchedPupils,
} from "../../backend/matching/dbconnection";
import { Connection, createConnection, EntityManager } from "typeorm";
import { Pupil } from "../../../common/entity/Pupil";
import {
    subjectsAsArray,
    unifiedFormOfSubjects,
} from "../../backend/matching/subjectsutils";
import { gradeAsInt } from "../../backend/utils";
import { Student } from "../../../common/entity/Student";
import { Person } from "../../../common/entity/Person";

import { createObjectCsvWriter } from "csv-writer";

function transformStudentToMatchingExport(student: Student) {
    const subjarray = subjectsAsArray(student.subjects);

    if (subjarray.length === 0) {
        //no subjects, this is not a valid matching export
        console.log(
            `Student with email ${student.email} is invalid for export!`
        );
        return null;
    }

    return {
        id: student.wix_id, //wix-ID
        subjects: JSON.stringify(unifiedFormOfSubjects(subjarray)), //give the subjects a unified appearance
        email: student.email,
        firstname: student.firstname,
        lastname: student.lastname,
        registeredDate: student.wix_creation_date,
    };
}

function transformPupilToMatchingExport(pupil: Pupil) {
    const subjarray = subjectsAsArray(pupil.subjects);

    if (subjarray.length === 0) {
        //no subjects, this is not a valid matching export
        console.log(`Pupil with email ${pupil.email} is invalid for export!`);
        return null;
    }

    return {
        id: pupil.wix_id, //wix-ID
        subjects: JSON.stringify(subjarray), //don't give the subjects a unified appearance, because subjects of pupils will always be the same and simple as always
        grade: gradeAsInt(pupil.grade),
        email: pupil.email,
        firstname: pupil.firstname,
        lastname: pupil.lastname,
        registeredDate: pupil.wix_creation_date,
    };
}

async function exportableUnmatchedAndVerifiedStudents(manager: EntityManager) {
    //get all unmatched and verified students
    const unmatchedAndVerifiedStudents = await getUnmatchedAndVerifiedStudents(
        manager
    );

    let exportableUnmatchedAndVerifiedStudents = unmatchedAndVerifiedStudents.map(
        transformStudentToMatchingExport
    );

    //filter out invalid entries
    exportableUnmatchedAndVerifiedStudents = exportableUnmatchedAndVerifiedStudents.filter(
        (s) => s !== null
    );

    return exportableUnmatchedAndVerifiedStudents;
}
async function exportableUnmatchedPupils(manager: EntityManager) {
    const unmatchedPupils = await getUnmatchedPupils(manager);

    let exportableUnmatchedPupils = unmatchedPupils.map(
        transformPupilToMatchingExport
    );

    //delete not correctly valid/invalid pupil-entries
    //1. those which resulted in an invalid matching export
    exportableUnmatchedPupils = exportableUnmatchedPupils.filter(
        (p) => p !== null
    );

    return exportableUnmatchedPupils;
}

async function writeExportObjects(objects: object[], destination: string) {
    let header = []; //default empty
    if (objects.length > 0) {
        header = Object.getOwnPropertyNames(objects[0]).map((name) => {
            return { id: name, title: name };
        });
    }

    const writer = createObjectCsvWriter({
        path: destination,
        header: header,
    });

    await writer.writeRecords(objects);
}

const exportFolder = `${process.cwd()}/exports`;
const ExportPaths = {
    students: `${exportFolder}/students.csv`,
    pupils: `${exportFolder}/pupils.csv`,
};

async function exportForMatching(manager: EntityManager) {
    let studentsToExport = await exportableUnmatchedAndVerifiedStudents(
        manager
    );
    let pupilsToExport = await exportableUnmatchedPupils(manager);

    //export them now
    await writeExportObjects(studentsToExport, ExportPaths.students);
    await writeExportObjects(pupilsToExport, ExportPaths.pupils);
}

export async function exportUnmatchedStudentsAndPupils() {
    try {
        const connection = await createConnection();

        //do everything in a single transaction
        await connection.transaction(async (transactionManager) => {
            // Begin export...
            console.log("Begin export...");

            await exportForMatching(transactionManager);

            console.log("Export finished...");
            console.log(`Wrote files to: ${exportFolder}`);
        });

        //close connection again...
        connection.close();
    } catch (e) {
        console.log("Error: ", e);
    }
}
