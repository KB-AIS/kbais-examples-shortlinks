import configsProvider from 'config';

export const getConfigsOrDefault = <T>(section: string, configsDefault: T): T => {
    const hasSection = configsProvider.has(section)

    if (hasSection) {
        return configsProvider.get<T>(section);
    }

    if (configsDefault !== undefined) {
        return configsDefault;
    }

    throw new Error('Required configs has not been provided');
}
