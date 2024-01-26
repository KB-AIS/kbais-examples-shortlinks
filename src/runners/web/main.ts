import {appPersistenceContext} from '~sl-core.infra/services/mongo.context';
import {logger} from '~sl-core/utils';
import {hostRunner, IHostOptions} from './configuration/hosting/host.runner';

const onStartup = (opts: IHostOptions) => {
    logger.info('App listening on port %d', opts.port);
};

const onBeforeShutdown = async (_signal?: string) => {
    await appPersistenceContext.dispose();
};

const onAfterShutdown = (_signal?: string) => {
    logger.info('App has been shutdown');

    return Promise.resolve();
};

const main = async () => {
    // Setup system external dependencies
    await appPersistenceContext.configure();

    hostRunner(onStartup, onBeforeShutdown, onAfterShutdown);
}

main().catch(error =>
    logger.fatal(error, 'Catch an error during \'main\' function execution')
);
