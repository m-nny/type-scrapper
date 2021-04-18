import { RecipeKey } from './Recipe';

export class RecipeNotFoundError extends Error {
    public constructor(public searchKey: RecipeKey) {
        super('Recipe not found');
    }
}
