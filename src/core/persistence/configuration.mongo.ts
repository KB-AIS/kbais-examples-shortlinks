import mongoose, { Model, Mongoose, Schema } from 'mongoose';
import { IUserProps } from '~sl-modules/users';

const entitySchemas = new Map<string, Schema>();

entitySchemas.set('user', new Schema<IUserProps>({
    username: String,
    password: String
}));

const entityModels = new Map<string, Model<any>>;

const setupModel = <TSchema extends Schema = any>(
    connection: Mongoose, name: string, schema: TSchema
) => {
    return connection.model(name, schema);
};

const SERVICE_MONGO_URL_DEFAULT = 'mongodb://dev:dev@localhost:5010/';

const serviceMongoUrl = process.env.SL_SERVICE__MONGO_URL || SERVICE_MONGO_URL_DEFAULT;

export const createMongooseConnectionPool = (): Promise<Mongoose> => {
    return mongoose.connect(serviceMongoUrl);
};

/* export const createMongoSession = (): Promise<ClientSession> => {
    return mongoose.startSession();
} */

export const getModel = <TEntity>(name: string): Model<TEntity> => {
    const model = entityModels.get(name);

    return model!;
}

export const configureMongo = async (): Promise<void> => {
    const connectionPool = await createMongooseConnectionPool();

    entitySchemas.forEach((schema, name) => {
        const entityModel = setupModel(connectionPool, name, schema);

        entityModels.set(name, entityModel);
    });

    return;
}