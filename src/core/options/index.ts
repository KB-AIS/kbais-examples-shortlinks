import optionsProvider from 'config';

export const getOptionsOrDefault = <T>(optionsSection: string, optionsDefault: T): T => {
    const hasOptionsSectoin = optionsProvider.has(optionsSection)

    if (hasOptionsSectoin) {
        return optionsProvider.get<T>(optionsSection);
    }

    if (optionsDefault !== undefined) {
        return optionsDefault;
    }

    throw new Error('Required options has not been provided');
}
