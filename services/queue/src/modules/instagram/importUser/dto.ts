import { ImportInstagramUserArg } from '@app/models';
import { IsString } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class ImportInstagramUserInput implements ImportInstagramUserArg {
    @IsString()
    @Field()
    public username!: string;
}
