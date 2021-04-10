import { Field, ID, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Repository } from 'typeorm';

@ObjectType()
@Entity()
export class Recipe {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    public id!: string;

    @Field()
    @Column()
    public title!: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public description?: string;

    @Field()
    @CreateDateColumn({ type: 'timestamptz' })
    public creationDate!: Date;

    @Field(() => [String])
    public ingredients!: string[];
}

export type RecipeKey = Pick<Recipe, 'id'>;
export type RecipeRepository = Repository<Recipe>;

export type CreateRecipeArgs = Pick<Recipe, 'title' | 'description' | 'ingredients'>;
