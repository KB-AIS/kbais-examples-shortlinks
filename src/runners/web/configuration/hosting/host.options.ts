export interface IHostOptions {
    port: number,
}

export const params = {
    section: 'services.host',
    default: {
        port: 5000,
    },
}
