export interface IPasswordHasher {
    hash(password: string): Promise<string>;

    isGenuine(password: string, hashedPassword: string): Promise<boolean>;
}
