export class EmailResponseModel {
    val: number;
}

export class EmailRequestModel {
    EmailModel: EmailModel;
    ReportsModel: ReportsModel[];
    constructor() {
        this.EmailModel = new EmailModel();
        this.ReportsModel = [];
    }
}

export class EmailModel {
    userID: number;
    outletID: number;
    email: string;
}

export class ReportsModel {
    mID: number;
    name: string;
}