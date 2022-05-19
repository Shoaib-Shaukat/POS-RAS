export class VendorModelRequest {
    vendorID: number;
    vendorName: string;
    vendorAddress: string;
    cityID: string;
    stateID: string;
    postalCode: number;
    countryID: string;
    phoneNo: string;
    mobileNo: string;
    faxNo: string;
    email: string;
    isActive: boolean;
    userID: number;
    outletID: number;
}
export class VendorModelResponse {
    vendorID: number;
    vendorName: string;
    vendorAddress: string;
    cityID: string;
    stateID: string;
    postalCode: number;
    countryID: string;
    phoneNo: string;
    mobileNo: string;
    faxNo: string;
    email: string;
    isActive: boolean;
    userID: number;
    outletID: number;
}


export class requestStRegions {
    CountryId:number;
}
export class responseRegions {
    Id:number;
    regionName:string;
    CountryId:number;
}
export class requestCity {
    RegionId:number;

}
export class responseCity {
    Id:number;
    cityName:string;
}
export class responseCountries {
    id:number;
    countryName:string;
}