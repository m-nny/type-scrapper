import { ArrayMaxSize, IsUUID, Length, MaxLength } from 'class-validator';
import { ArgsType, Field, ID, InputType } from 'type-graphql';
import { RecipeKey } from './Recipe';

@ArgsType()
export class RecipeArgs implements RecipeKey {
    @Field(() => ID)
    @IsUUID()
    public id!: string;
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
