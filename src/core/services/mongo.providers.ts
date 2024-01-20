import { ClientSession, Model } from 'mongoose';

export interface IMongoModelProvider {
    get<TEntity>(name: string): Model<TEntity>;
}

export interface IMongoSessionProvider {
    begin(): Promise<ClientSession>;
}
