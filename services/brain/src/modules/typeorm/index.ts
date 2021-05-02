import { retryPromise } from '@app/common';
import { TlsOptions } from 'tls';
import { Connection, createConnection, getConnection } from 'typeorm';
import { PlainConfig } from '../../config';
import { entities, migrations } from '../index';

const makeSslOptions = (config: PlainConfig): TlsOptions | boolean | undefined =>
    config.pg.ssl.disabled ? undefined : config.pg.ssl;
export const makeTypeORMConnection = async (config: PlainConfig): Promise<Connection> => {
    const connection = await retryPromise(
        () =>
            createConnection({
                type: 'postgres',
                entities,
                migrations,
                ...config.pg,
                ...config.typeorm,
                ssl: makeSslOptions(config),
            }),
        config.connectionRetry,
    );
    return connection;
};
