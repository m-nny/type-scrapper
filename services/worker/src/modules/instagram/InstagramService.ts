import { makeUrl, retryWrapper } from '@app/common';
import { GraphQLClient } from 'graphql-request';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { getSdk, Sdk } from './sdk';

@singleton()
export class InstagramMicroservice {
    private client: GraphQLClient;
    public sdk: Sdk;
    public constructor({ config }: ConfigWrapper) {
        this.client = new GraphQLClient(makeUrl(config.microservice.instagram));
        this.sdk = getSdk(this.client, retryWrapper(config.microservice.retry));
    }
}
