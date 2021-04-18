import { singleton } from 'tsyringe';
import { Connection } from 'typeorm';
import { TListPage } from '../common/type';
import { CreateRecipeArgs, Recipe, RecipeKey, RecipeRepository } from './Recipe';

@singleton()
export class RecipeService {
    private recipeRepository: RecipeRepository;
    public constructor(connection: Connection) {
        this.recipeRepository = connection.getRepository(Recipe);
    }
    public find(key: RecipeKey): Promise<Recipe | undefined> {
        return this.recipeRepository.findOne(key);
    }
    public findAll({ take, skip }: TListPage): Promise<Recipe[]> {
        return this.recipeRepository.find({ take, skip });
    }
    public create(data: CreateRecipeArgs): Promise<Recipe> {
        const recipe = this.recipeRepository.create(data);
        return this.recipeRepository.save(recipe);
    }
}
