import { singleton } from 'tsyringe';
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { NewRecipeInput, RecipeArgs, RecipesArgs } from './dto';
import { Recipe } from './Recipe';
import { RecipeService } from './RecipeService';
import { RecipeNotFoundError } from './utils';

@Resolver(Recipe)
@singleton()
export class RecipeResolver {
    public constructor(private recipeService: RecipeService) {}

    @Query(() => Recipe)
    public async recipe(@Args() { id }: RecipeArgs): Promise<Recipe> {
        const recipe = await this.recipeService.find({ id });
        if (recipe === undefined) {
            throw new RecipeNotFoundError({ id });
        }
        return recipe;
    }

    @Query(() => [Recipe])
    public recipes(@Args() { skip, take }: RecipesArgs): Promise<Recipe[]> {
        return this.recipeService.findAll({ skip, take });
    }

    @Mutation(() => Recipe)
    // @Authorized()
    public addRecipe(@Arg('newRecipeData') newRecipeData: NewRecipeInput): Promise<Recipe> {
        return this.recipeService.create(newRecipeData);
    }
}
