export interface ApiResponse<T> {
    items: T[];
    maxCount: number;
}

export interface ApiStudent {
    geburtstag: string;
    feldFurMehrfachauswahl: string[];
    submissionTime: string;
    email: string;
    _id: string;
    _createdDate: string;
    kopieVonVorname: string;
    _updatedDate: string;
    firstName: string;
    message?: string;
}

export interface ApiPupil {
    feldFurMehrfachauswahl: string[];
    submissionTime: string;
    email: string;
    _id: string;
    _createdDate: string;
    kopieVonFeldFurAufklappmenu: string;
    kopieVonVorname: string;
    _updatedDate: string;
    firstName: string;
}
