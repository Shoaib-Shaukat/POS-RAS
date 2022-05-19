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
    requestTaxModel: requestTaxModel[];
    constructor() {
        this.requestVariants = [];
        this.requestItemIngredientDetail = [];
        this.requestFoodMenuItem = new requestFoodMenuItem();
        this.requestTaxModel = [];
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

export class requestTaxModel {
    taxID: number;
    taxName: string;
    taxRate: number;
    isActive: boolean;
    outletID: number;
    foodItemID: number;
}
export class taxesResponseModel {
    taxID: number;
    taxName: string;
    taxRate: number;
    isActive: boolean;
    outletID: number;
    foodItemID: number;
}

export class requestTaxDetail {
    taxID: number;
    taxName: string;
    taxRate: number;
    isActive: boolean;
    outletID: number;
    foodItemID: number;
}