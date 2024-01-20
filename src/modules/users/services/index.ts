import { appPersistenceContext } from "~sl-core/persistence/configuration.mongo";
import MongooseUserRepository from "./impl/user.mongo.repository";
import { IUserRepository } from "./user.repository";

export const getUserRepository = (): IUserRepository =>
    new MongooseUserRepository(appPersistenceContext);

export type { IUserRepository };
