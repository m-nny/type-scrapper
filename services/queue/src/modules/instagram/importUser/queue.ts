import { ImportInstagramUserArg } from '@app/models';
import { Queue } from 'bullmq';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../../config';
import { RedisWrapper } from '../../utils/wrappers';

@singleton()
export class ImportInstagramUserQueue {
    public queue: Queue<ImportInstagramUserArg>;
    public constructor({ config }: ConfigWrapper, { redis }: RedisWrapper) {
        this.queue = new Queue(config.queue.names.importInstagramUser, { connection: redis });
    }
}
