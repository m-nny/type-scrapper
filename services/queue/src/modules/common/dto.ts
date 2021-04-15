import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int, ObjectType } from 'type-graphql';
import { TListPage } from './type';

@ArgsType()
export class ListPageArgs implements TListPage {
    @Field(() => Int)
    @Min(0)
    skip: number = 0;

    @Field(() => Int)
    @Min(0)
    @Max(50)
    take: number = 25;
}

@ObjectType()
export class ListPage implements TListPage {
    @Field(() => Int)
    skip: number = 0;

    @Field(() => Int)
    take: number = 25;
}
