import { EntityManager } from "typeorm";
import { Student } from "../../../common/entity/Student";
import { Pupil } from "../../../common/entity/Pupil";

async function insertTestData(transactionManager: EntityManager) {
    //if that fails, this will probably due to already existing records with the same email adresses
    const s = new Student();
    s.firstname = "S-Gero";
    s.lastname = "Embser";
    s.email = "gero@students.example.com";
    s.wix_creation_date = new Date();
    s.birthday = new Date();
    s.subjects = `["Mathematik","Deutsch","Englisch","Biologie","Politik"]`;
    s.msg = `Hallo Welt! Was sonst...`;
    s.wix_id = `b97ae228-3471-492d-bf86-0d37755aae4f`;
    s.phone = `+491234567890`;

    const p = new Pupil();
    p.firstname = "P-Gero";
    p.lastname = "Embser";
    p.email = "gero@pupils.example.com";
    p.wix_creation_date = new Date();
    p.state = "Nordrhein-Westfalen";
    p.subjects = `["Mathematik","Geschichte","Politik","Wirtschaft"]`;
    p.msg = "nervt...";
    p.wix_id = "2e5d0c6b-558f-40b3-adc6-5d9d5b7f149a";
    p.grade = "13. Klasse";

    transactionManager.save(s);
    transactionManager.save(p);
}

export { insertTestData };
