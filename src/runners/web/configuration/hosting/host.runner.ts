import { getConfigsOrDefault } from 'core.infra/configs/index';
import gracefulShutdown from 'http-graceful-shutdown';
import ViteExpress from 'vite-express';
import hostComposer from './host.composer';

export interface IHostOptions {
    port: number,
}

export const hostOptionsParams = {
    section: 'services.host',
    default: { port: 5000, },
}

const hostOptions = getConfigsOrDefault<IHostOptions>(hostOptionsParams.section, hostOptionsParams.default);

export const hostRunner = (
    onAfterStartup?:   (opts: IHostOptions) => void,
    onBeforeShutdown?: (signal?: string) => Promise<void>,
    onAfterShutdown?:  (signal?: string) => Promise<void>,
) => {
    const host = ViteExpress.listen(hostComposer, hostOptions.port, () => {
        if (onAfterStartup) {
            onAfterStartup(hostOptions);
        }
    });

    gracefulShutdown(host, {
        signals:     'SIGINT SIGTERM',
        timeout:     10_000,
        development: false,
        forceExit:   true,
        preShutdown: onBeforeShutdown,
        onShutdown:  onAfterShutdown,
    });
}