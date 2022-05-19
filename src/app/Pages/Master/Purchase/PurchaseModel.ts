export class FoodCatResponseModel {
    constructor() {
        this.foodMenuID = 0;
        this.foodMenuName = "";
        this.isActive = false;
        this.outletID = 0;
    }
    foodMenuID: number;
    foodMenuName: string;
    isActive: boolean;
    outletID: number;
}


export class MenuItemsModel {
    requestVariants: requestVariant[];
    requestFoodMenuItem: requestFoodMenuItem;
    requestItemIngredientDetail: requestItemIngredientDetail[];
    constructor() {
        this.requestVariants = [];
        this.requestItemIngredientDetail = [];
        this.requestFoodMenuItem = new requestFoodMenuItem();
    }
}
export class requestFoodMenuItem {
    foodItemID: number;
    foodItemName: string;
    description: string;
    price: number;
    isActive: boolean;
    hasVariant: boolean;
    foodMenuID: number;
    UserID: number;
    discount: number;
    calculatedPrice: number;
    imageURl: any;
    refCode: string;
    outletID: number;
    sectionID: number;
    currencyID: number;
    preparationTime: number;
    generalRemarks: string;
    prepRemarks: string;
}
export class requestItemIngredientDetail {
    pID: number;
    quantity: number;
    amount: number;
    instructions: string;
    description: string;
    unitName: string;
    costPrice: number;
    foodItemID: number;
    itemIgredeintID: number;
    total: number;
}
export class responseFoodMenuItem {
    foodItemID: number;
    foodItemName: string;
    description: string;
    price: number;
    isActive: boolean;
    hasVariant: boolean;
    foodMenuID: number;
    UserID: number;
    discount: number;
    calculatedPrice: number;
    imageURl: any;
    foodMenuName: string;
    refCode: string;
    outletID: number;
    currencyID: number;
    generalRemarks: string;
    prepRemarks: string;
    preparationTime: number;
    sectionID: number;
}
export class requestVariant {
    variantID: number;
    variantName: string;
    variantPrice: number;
    discount: number;
    calculatedPrice: number;
    description: string;
    foodItemID: number;
    imageURL: any;
    RefCode: string;
    outletID: number;
}
export class responseVariant {
    variantID: number;
    variantName: string;
    variantPrice: number;
    discount: number;
    calculatedPrice: number;
    description: string;
    foodItemID: number;
    imageURL: any;
    RefCode: string;
    outletID: number;
}

export class SectionModelResponse {
    sectionID: number;
    sectionName: string;
    defaultPrinter: string;
    outletID: number;
    userID: number;
}

export class CurrencyModelResponse {
    currencyID: number;
    currencyName: string;
    symbol: string;
    UserID: number;
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
    quantity: number;
    amount: number;
    instructions: string;
}

export class responseItemIgredientDetail {
    amount: number;
    costPrice: number;
    description: string;
    foodItemID: number;
    itemIgredeintID: number;
    pID: number;
    quantity: number;
    unitName: string;
    instructions: string;
}

export class purchaseModel {
    vendorID: number;
    date: string;
    gTotal: number;
    paid: number;
    due: number;
}

export class ingredientArrModel {
    ingredientID: number;
    unitPrice: number;
    quantity: number;
    total: number;
}

export class purchaseModelRequest {
    purchaseModel: purchaseModel;
    ingredientArrModel: ingredientArrModel[];

    constructor() {
        this.purchaseModel = new purchaseModel();
        this.ingredientArrModel = [];
    }
}

export class purchaseModelResponse {
    vendorID: number;
    vendorName: number;
    purchaseDate: string;
    gTotal: number;
    paid: number;
    due: number;
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