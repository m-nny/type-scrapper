import { Arg, Query, Resolver } from 'type-graphql';
import { CacheControl } from './cache-control';
import { createRecipeSamples } from './recipe.samples';
import { Recipe } from './recipe.type';
@Resolver((of) => Recipe)
export class RecipeResolver {
    private readonly items: Recipe[] = createRecipeSamples();

    @Query((returns) => Recipe, { nullable: true })
    async recipe(@Arg('title') title: string): Promise<Recipe | undefined> {
        console.log(`Called 'simpleRecipe' with title '${title}'`);
        return await this.items.find((recipe) => recipe.title === title);
    }

    @Query((returns) => Recipe, { nullable: true })
    // here we declare that ApolloEngine will cache the query for 60s
    @CacheControl({ maxAge: 60 })
    async cachedRecipe(@Arg('title') title: string): Promise<Recipe | undefined> {
        console.log(`Called 'cachedRecipe' with title '${title}'`);
        return await this.items.find((recipe) => recipe.title === title);
    }

    @Query((returns) => [Recipe])
    async recipes(): Promise<Recipe[]> {
        return await this.items;
    }
}
