import { throwIfError } from '@app/models';
import { singleton } from 'tsyringe';
import { Query, Resolver } from 'type-graphql';
import { InstagramClient } from '../client';
import { TInstagramProfile } from '../client/types';
import { InstagramProfile } from './dto';

@singleton()
@Resolver(InstagramProfile)
export class InstagramProfileResolver {
    public constructor(private client: InstagramClient) {}
    @Query(() => InstagramProfile)
    public async myProfile(): Promise<TInstagramProfile> {
        const profile = await this.client.getProfile().then(throwIfError);
        return profile;
    }
}
