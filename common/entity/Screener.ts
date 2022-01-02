import { Entity, Column, OneToMany, EntityManager, Index } from "typeorm";
import { ScreenerDTO } from "../dto/ScreenerDTO";
import { Screening } from "./Screening";
import { Person } from "./Person";

@Entity()
export class Screener extends Person {
    /* Like all Persons, the Screener also has a unique UserID (across all entities).
       In other Persons this is called "wix_id" for historical reasons */
    @Column()
    @Index({
        unique: true
    })
    userID: string;

    @Column()
    password: string;

    @Column({
        default: false,
        nullable: true
    })
    verified: boolean;

    @Column({
        nullable: true,
        unique: true
    })
    oldNumberID: number; //the number that screener had in the old database

    @OneToMany((type) => Screening, (screening) => screening.screener, {
        nullable: true
    })
    screenings: Promise<Screening[]>;

    async addScreenerDTO(screenerDTO: ScreenerDTO) {
        this.firstname = screenerDTO.firstname;
        this.lastname = screenerDTO.lastname;
        this.email = screenerDTO.email;
        this.password = screenerDTO.passwordHash;
        this.verified = screenerDTO.verified;
        this.active = screenerDTO.active;
    }

    async updateWithScreenerDTO(screenerDTO: ScreenerDTO) {
        this.firstname = screenerDTO.firstname === undefined ? this.firstname : screenerDTO.firstname;
        this.lastname = screenerDTO.lastname === undefined ? this.lastname : screenerDTO.lastname;
        this.email = screenerDTO.email === undefined ? this.email : screenerDTO.email;
        this.password = screenerDTO.passwordHash === undefined ? this.password : screenerDTO.passwordHash;
        this.verified = screenerDTO.verified === undefined ? this.verified : screenerDTO.verified;
        this.active = screenerDTO.active === undefined ? this.active : screenerDTO.active;
    }
}

export function getScreenerByEmail(manager: EntityManager, email: string): Promise<Screener> | undefined {
    return manager.findOne(Screener, { email: email });
}

export function getScreenerWithNumberFromOldDB(manager: EntityManager, screenerNumber: number) {
    return manager.findOne(Screener, { oldNumberID: screenerNumber });
}

export function getScreenersWithFirstname(manager: EntityManager, firstname: string) {
    return manager.find(Screener, { firstname: firstname });
}

const DEFAULT_SCREENER_FIRSTNAME = "DEFAULT_SCREENER";
export const DEFAULT_SCREENER_NUMBER_ID = -1;

export async function getDefaultScreener(manager: EntityManager) {
    let defaultScreener = await getScreenerWithNumberFromOldDB(manager, DEFAULT_SCREENER_NUMBER_ID);

    if (!defaultScreener) {
        defaultScreener = new Screener();
        defaultScreener.firstname = DEFAULT_SCREENER_FIRSTNAME;
        defaultScreener.lastname = "";
        defaultScreener.password = "";
        defaultScreener.verified = true;
        defaultScreener.oldNumberID = DEFAULT_SCREENER_NUMBER_ID;
        defaultScreener.email = "kontakt@corona-school.de";
        defaultScreener.active = false;

        await manager.save(defaultScreener);
    }

    return defaultScreener;
}
