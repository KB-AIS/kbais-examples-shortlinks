import { getConfigsOrDefault } from '~sl-core.infra/configs';
import mongoose, { ClientSession, Model, Mongoose, Schema } from 'mongoose';
import { IMongoModelProvider, IMongoSessionProvider } from "~sl-core/services/mongo.providers";
import { IUserProps } from '~sl-modules/users';

export interface IMongooseInitializator {
    configure(): Promise<void>;

    dispose(): Promise<void>;
}

export interface IMongoServiceOptions {
    url: string;
}

export class MongoContext implements IMongoModelProvider, IMongoSessionProvider, IMongooseInitializator {
    private entityModels = new Map<string, Model<any>>;

    private entitySchemas = new Map<string, Schema>();

    constructor(private options: IMongoServiceOptions) {
        // TODO: Retrive from ContextSchemaBuilder?
        this.entitySchemas.set('user', new Schema<IUserProps>({
            username: String,
            password: String
        }));
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

    get<TEntity>(name: string): Model<TEntity> {
        const model = this.entityModels.get(name);
        
        return model!;
    }
    
    begin(): Promise<ClientSession> {
        return mongoose.startSession();
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

const mongoOptions = getConfigsOrDefault<IMongoServiceOptions>(
    'services.persistence.mongo', { url: '' }
);

export const appPersistenceContext = new MongoContext(mongoOptions)
