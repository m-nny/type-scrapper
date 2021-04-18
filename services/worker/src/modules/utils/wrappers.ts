import { Redis } from 'ioredis';

export class RedisWrapper {
    public constructor(public redis: Redis) {}
}
