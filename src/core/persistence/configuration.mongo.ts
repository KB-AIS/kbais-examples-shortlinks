import mongoose, { ClientSession, Model, Mongoose, Schema } from 'mongoose';
import { getOptionsOrDefault } from '~sl-core/options/index';
import { IUserProps } from '~sl-modules/users';

export interface IMongoModelProvider {
    getModel<TEntity>(modelName: string): Model<TEntity>;
}

export interface IMongoSessionProvider {
    begin(): Promise<ClientSession>;
}

export interface IMongoConfigurator {
    configure(): Promise<void>;

    dispose(): Promise<void>;
}

export interface IMongoServiceOptions {
    url: string;
}

export class AppPersistenceContext implements IMongoModelProvider, IMongoSessionProvider, IMongoConfigurator {
    private entityModels = new Map<string, Model<any>>;

    private entitySchemas = new Map<string, Schema>();

    constructor(private options: IMongoServiceOptions) {
        this.entitySchemas.set('user', new Schema<IUserProps>({
            username: String,
            password: String
        }));
    }

    getModel<TEntity>(modelName: string): Model<TEntity> {
        const model = this.entityModels.get(modelName);
        
        return model!;
    }
    
    begin(): Promise<ClientSession> {
        return mongoose.startSession();
    }

    async configure(): Promise<void> {
        const connection = await this.onConnectionPoolCreating(this.options.url);

        this.entitySchemas.forEach((modelSchema, modelName) => {
            const entityModel = this.onModelSchemaCreating(connection, modelName, modelSchema);
    
            this.entityModels.set(modelName, entityModel);
        });
    }

    dispose(): Promise<void> {
        return mongoose.disconnect();
    }

    private onConnectionPoolCreating(serviceMongoUrl: string): Promise<Mongoose> {
        return mongoose.connect(serviceMongoUrl);
    };

    private onModelSchemaCreating<TSchema extends Schema = any>(
        connection: Mongoose, name: string, schema: TSchema
    ) {
        return connection.model(name, schema);
    };
}

const mongoOptions = getOptionsOrDefault<IMongoServiceOptions>(
    'services.persistence.mongo', { url: '' }
);

export const appPersistenceContext = new AppPersistenceContext(mongoOptions)
