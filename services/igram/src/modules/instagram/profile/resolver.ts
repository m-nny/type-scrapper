import { throwIfError } from '@m-nny/common/dist/axios';
import { singleton } from 'tsyringe';
import { Int, Query, Resolver } from 'type-graphql';
import { InstagramClient } from '../client';
import { TInstagramProfile } from '../client/types';
import { InstagramProfile } from './dto';

@singleton()
@Resolver()
export class InstagramProfileResolver {
    public constructor(private client: InstagramClient) {}
    @Query(() => Int)
    public zero() {
        return 0;
    }
    @Query(() => InstagramProfile)
    public async profile(): Promise<TInstagramProfile> {
        const profile = await this.client.getProfile().catch(throwIfError);
        return profile;
    }
}
