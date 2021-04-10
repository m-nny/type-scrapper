import { InstagramUser } from './instagram/InstagramUserEntity';
import { Recipe } from './recipe/Recipe';
import { RecipeResolver } from './recipe/RecipeResolver';

export const entities = [InstagramUser, Recipe];
export const migrations = [];

export const resolvers = [RecipeResolver] as const;
