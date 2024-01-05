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

const createMongooseConnectionPool = (serviceMongoUrl: string): Promise<Mongoose> => {
    return mongoose.connect(serviceMongoUrl);
};

/* export const createMongoSession = (): Promise<ClientSession> => {
    return mongoose.startSession();
} */

export const getModel = <TEntity>(name: string): Model<TEntity> => {
    const model = entityModels.get(name);

    return model!;
}

export const configureMongo = async (serviceMongoUrl: string): Promise<void> => {
    const connectionPool = await createMongooseConnectionPool(serviceMongoUrl);

    entitySchemas.forEach((schema, name) => {
        const entityModel = setupModel(connectionPool, name, schema);

        entityModels.set(name, entityModel);
    });

    return;
}

export const shutdownMongo = () => {
    return mongoose.disconnect();
}
