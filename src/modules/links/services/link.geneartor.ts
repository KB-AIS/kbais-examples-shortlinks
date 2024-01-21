import { customAlphabet } from "nanoid";

const LINK_GENERATOR_ALPABETH = "abcdefghkmnpqrstuvwxyzABCDEFGHKLMNPQRSTUVWXYZ23456789";

const LINK_GENERATOR_LENGTH = 8;

export interface ILinkGenerator {
    get(): string;
}

export class NanoidLinkGenerator implements ILinkGenerator {
    private readonly underlyingGenerator: (size?: number) => string;

    constructor() {
        this.underlyingGenerator =
            customAlphabet(LINK_GENERATOR_ALPABETH, LINK_GENERATOR_LENGTH);
    }

    get = (): string => this.underlyingGenerator();
}
