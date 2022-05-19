export class SubCategoryRequest {
    ingredientCategoryID: number;
    Name: string;
    isActive: boolean;
    IngredientID: number;
    OutletID: number;
    UserID: number;
}
export class SubCategoryResponse {
    ingredientCategoryID: number;
    oName: string;
    isActive: boolean;
    ingredientID: number;
    ingredientName: string;
    outletID: number;
    UserID: number;
}

export class IngredientResponse {
    ingredientID: number;
    name: string;
    isActive: boolean;
    outletID: number;
}