export class taxesRequestModel {
    taxID: number;
    taxName: string;
    taxRate: number;
    isActive: boolean;
    outletID: number;
}

export class taxesResponseModel {
    taxID: number;
    taxName: string;
    taxRate: number;
    isActive: boolean;
    outletID: number;
}