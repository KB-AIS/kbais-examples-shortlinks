import gracefulShutdown from 'http-graceful-shutdown';
import ViteExpress from 'vite-express';
import { getOptionsOrDefault } from '~sl-core/options';
import hostComposer from './host.composer';
import { IHostOptions, params as hostOptionsParams } from './host.options';

const hostOptions = getOptionsOrDefault<IHostOptions>(hostOptionsParams.section, hostOptionsParams.default);

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

    return gracefulShutdown(host, {
        signals:     'SIGINT SIGTERM',
        timeout:     3000,
        development: false,
        forceExit:   true,
        preShutdown: onBeforeShutdown,
        onShutdown:  onAfterShutdown,
    })();
}