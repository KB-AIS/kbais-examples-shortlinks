export enum UserKind { ANON, SIGNED }

export interface IUserProps {
    kind: UserKind,
    username: string,
    password: string | undefined,
}

// TODO: Think to model users diffrently
export class User implements IUserProps {
    constructor(readonly id: string, private props: Required<IUserProps>) { }

    get kind(): UserKind {
        return this.props.kind;
    }

    get username(): string {
        return this.props.username;
    }

    get password(): string | undefined {
        return this.props.password;
    }
}