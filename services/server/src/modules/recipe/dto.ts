import { ArrayMaxSize, IsUUID, Length, Max, MaxLength, Min } from 'class-validator';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { RecipeKey } from './Recipe';

@ArgsType()
export class RecipeArgs implements RecipeKey {
    @Field(() => ID)
    @IsUUID()
    public id!: string;
}

@ArgsType()
export class RecipesArgs {
    @Field(() => Int)
    @Min(0)
    skip: number = 0;

    @Field(() => Int)
    @Min(0)
    @Max(50)
    take: number = 25;
}

@InputType()
export class NewRecipeInput {
    @Field()
    @MaxLength(30)
    public title!: string;

    @Field({ nullable: true })
    @Length(30, 255)
    public description?: string;

    @Field(() => [String])
    @ArrayMaxSize(30)
    public ingredients!: string[];
}
