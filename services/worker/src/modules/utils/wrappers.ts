import { Redis } from 'ioredis';
import { PlainConfig } from '../../config';

export class RedisWrapper {
    public constructor(public redis: Redis) {}
}