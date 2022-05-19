export class IngredientRequest {
    IngredientID: number;
    Name: string;
    isActive: boolean;
    outletID: number;
    UserID: number;
}
export class IngredientResponse {
    ingredientID: number;
    name: string;
    isActive: boolean;
    outletID: number;
}

// export class requestIngredientsCategory {
//     ingredientCategoryID: number;
//     Name: string;
//     isActive: boolean;
//     IngredientID: number;
//     OutletID: number;
//     UserID: number;
// }

export class requestIngredient {
    IngredientID: number;
    Name: string;
    isActive: boolean;
    outletID: number;
    UserID: number;
}