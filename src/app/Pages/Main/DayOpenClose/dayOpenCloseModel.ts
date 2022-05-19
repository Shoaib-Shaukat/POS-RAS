export class openCloseRequestModel {
    openingDate: string;
    isClosed: boolean;
    enKey: string;
    outletID: number;
    userID: number;
}

export class requestModel {
    requestOpenDayMaster: requestOpenDayMaster[];
    constructor() {
        this.requestOpenDayMaster = [];
    }
}
export class requestOpenDayMaster {
    userID: number;
    outletID: number;
    openingDate: string;
}
export class existingDaysResponse {
    outletID: number;
    openingDate: string;
    opendaymasterID: number;
    enKey: string;
}