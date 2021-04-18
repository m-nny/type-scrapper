import { instagramEntities, instagramResolvers } from './instagram';
import { Recipe } from './recipe/Recipe';
import { RecipeResolver } from './recipe/RecipeResolver';

export const entities = [...instagramEntities, Recipe];
export const migrations = [];

export const resolvers = [...instagramResolvers, RecipeResolver] as const;
