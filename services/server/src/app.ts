import express from 'express';
import { container as tsyringeContainer, DependencyContainer } from 'tsyringe';
import { Connection, useContainer as useContainerForTypeOrm } from 'typeorm';
import { ConfigWrapper, loadConfig, PartialConfig } from './config';
import { makeTypeORMConnection } from './modules/typeorm';

export const configureContainer = async (configOverride?: PartialConfig) => {
    const config = loadConfig(configOverride);
    const container = tsyringeContainer.createChildContainer();
    if (config.typeorm.disabled) {
        return container.register(ConfigWrapper, { useValue: new ConfigWrapper(config) });
    }
    const connection = await makeTypeORMConnection(config);
    return container
        .register(ConfigWrapper, { useValue: new ConfigWrapper(config) })
        .register(Connection, { useValue: connection });
};

export const createExpressApp = (container: DependencyContainer) => {
    useContainerForTypeOrm({ get: (x) => container.resolve(x as any) }, { fallback: false, fallbackOnErrors: false });
    const { config } = container.resolve(ConfigWrapper);
    const app = express();
    return app;
};
