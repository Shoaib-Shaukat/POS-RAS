export class requestProduct {
    pID: number;
    description: string;
    isActive: boolean;
    isImported: boolean;
    costPrice: number;
    baseSalePrice: number;
    discountPercentage: number;
    discountAmount: number;
    salePrice: number;
    opQuantity: number;
    opValue: number;
    recorderLevel: number;
    locationID: number;
    ingredientID: number;
    ingredientCategoryID: number;
    ingredientCompanyID: number;
    unitID: number;
    userID: number;
    outletID: number;
}
export class ProductModelResponse {
    pID: number;
    description: string;
    isActive: boolean;
    isImported: boolean;
    costPrice: number;
    baseSalePrice: number;
    discountPercentage: number;
    discountAmount: number;
    salePrice: number;
    opQuantity: number;
    opValue: number;
    recorderLevel: number;
    locationID: number;
    ingredientID: number;
    ingredientCategoryID: number;
    ingredientCompanyID: number;
    unitID: number;
    userID: number;
    outletID: number;
    ingredientCategoryName: string;
    ingredientCompanyName: string;
    ingredientName: string;
    locationName: string;
    unitName: string;
}
export class vendorResponse {
    cityID: number;
    countryID: number;
    email: string;
    faxNo: string;
    isActive: boolean;
    mobileNo: string;
    pID: number;
    phoneNo: string;
    postalCode: string;
    stateID: number;
    vendorID: number;
    vendorAddress: string;
    vendorDetailID: number;
    vendorName: string;
}
export class requestVendorDetail {
    vendorID: number;
}
export class IngredientResponse {
    ingredientID: number;
    name: string;
    isActive: boolean;
    outletID: number;
}
export class SubCategoryResponse {
    ingredientCategoryID: number;
    oName: string;
    isActive: boolean;
    ingredientID: number;
    outletID: number;
    UserID: number;
}
export class IngCompanyResponse {
    ingredientCompanyID: number;
    ingredientCompanyName: string;
    isActive: boolean;
    outletID: number;
    userID: number;
}
export class unitResponse {
    unitID: number;
    name: string;
    isActive: boolean;
    outletID: number;
}
export class LocationModelResponse {
    locationID: number;
    locationName: string;
    userID: number;
    outletID: number;
    isActive: boolean;
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

export class requestProductModel {
    requestProduct: requestProduct;
    requestVendorDetail: requestVendorDetail[];
    constructor() {
        this.requestProduct = new requestProduct();
        this.requestVendorDetail = [];
    }
}