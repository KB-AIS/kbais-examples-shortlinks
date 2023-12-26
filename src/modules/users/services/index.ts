import MongooseUserRepository from "./impl/user.mongo.repository";
import { IUserRepository } from "./user.repository";

const userRepository: IUserRepository = new MongooseUserRepository();

export {
    userRepository,
}