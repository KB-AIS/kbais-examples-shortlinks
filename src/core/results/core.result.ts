import { ADT } from 'ts-adt';

export type Either<E> = ADT<{ success: { }; failure: { error: E }; }>;

export type EitherV<V, E> = ADT<{ success: { value: V }; failure: { error: E }; }>;

export const success: () => Either<never> = () => ({ _type: 'success', });

export const failure: (error: string) => Either<string> = (error) => ({ _type: 'failure', error, });

export const failureE: <E>(error: E) => Either<E> = (error) => ({ _type: 'failure', error, });

export const successV: <V, E>(value: V) => EitherV<V, E> = (value) => ({ _type: 'success', value });

export const failureV: <V, E>(error: E) => EitherV<V, E> = (error) => ({ _type: 'failure', error });