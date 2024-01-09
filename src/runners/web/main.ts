import { configureMongo, shutdownMongo } from '~sl-core/persistence/configuration.mongo';
import { logger } from '~sl-core/utils';
import { IHostOptions } from './configuration/hosting/host.options';
import { hostRunner } from './configuration/hosting/host.runner';

const SERVICE_MONGO_URL_DEFAULT = 'mongodb://dev:dev@localhost:5010/';

const serviceMongoUrl = process.env.SL_SERVICE__MONGO_URL || SERVICE_MONGO_URL_DEFAULT;

const onStartup = (opts: IHostOptions) => {
    logger.info('App listening on port %d', opts.port);
};

const onBeforeShutdonw = (_signal?: string) => {
    logger.info('Connection pool to MongoDB is shutting down ');

    return shutdownMongo();
};

const onAfterShutdown = (_signal?: string) => {
    logger.info('App has been shutdown');

    return Promise.resolve();
};

main().catch((error: Error) => logger.fatal(error, 'Catch an error during \'main\' function execution'));

async function main() {
    await configureMongo(serviceMongoUrl);

    hostRunner(onStartup, onBeforeShutdonw, onAfterShutdown);
}