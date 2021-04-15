import { IsString } from 'class-validator';
import { ArgsType, Field, InputType } from 'type-graphql';
import { ImportInstagramUserArg } from './types';

@ArgsType()
export class ImportInstagramUserInput implements ImportInstagramUserArg {
    @IsString()
    @Field()
    public username!: string;
}
