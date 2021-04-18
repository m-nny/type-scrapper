import { utils } from '@app/common';
import { TlsOptions } from 'tls';
import { Connection, createConnection } from 'typeorm';
import { PlainConfig } from '../../config';
import { entities, migrations } from '../index';

const makeSslOptions = (config: PlainConfig): TlsOptions | boolean | undefined =>
    config.pg.ssl.disabled ? undefined : config.pg.ssl;
export const makeTypeORMConnection = (config: PlainConfig): Promise<Connection> =>
    utils.retryPromise(() =>
        createConnection({
            type: 'postgres',
            entities,
            migrations,
            ...config.pg,
            ...config.typeorm,
            ssl: makeSslOptions(config),
        }),
    );
