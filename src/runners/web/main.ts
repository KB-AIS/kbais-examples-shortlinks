import { appPersistenceContext } from '~sl-core.infra/services/mongo.context';
import { logger } from '~sl-core/utils';
import { hostRunner, IHostOptions } from './configuration/hosting/host.runner';

const onStartup = (opts: IHostOptions) => {
    logger.info('App listening on port %d', opts.port);
};

const onBeforeShutdonw = async (_signal?: string) => {
    logger.info('Connection pool to MongoDB is shutting down ');

    await appPersistenceContext.dispose();
};

const onAfterShutdown = (_signal?: string) => {
    logger.info('App has been shutdown');

    return Promise.resolve();
};

main().catch((error: Error) => {
    logger.fatal(error, 'Catch an error during \'main\' function execution')
});

async function main() {
    await appPersistenceContext.configure();

    hostRunner(onStartup, onBeforeShutdonw, onAfterShutdown);
}