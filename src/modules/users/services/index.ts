import { appPersistenceContext } from '~sl-core.infra/services/mongo.context';
import MongooseUserRepository from './impl/user.mongo.repository';
import { IUserRepository } from './user.repository';

export const getUserRepository = (): IUserRepository =>
    new MongooseUserRepository(appPersistenceContext);

export type { IUserRepository };
