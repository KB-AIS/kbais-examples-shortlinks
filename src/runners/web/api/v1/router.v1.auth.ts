import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { matchI } from 'ts-adt';
import { AuthServiceError, getAuthService } from '~sl-modules/auth';
import { RequestWithBody, StatusCodes, validate } from '../../core/api/index';

const authRouter = Router();

interface SignInDto { username: string, password: string, }

const signUpValidator = () => [
    body('username')
        .trim().escape()
        .notEmpty()
        .withMessage('Username field is required')
        .isLength({ min: 3, max: 10 })
        .withMessage('Username length should be from 3 to 10 characters'),
    body('password')
        .trim().escape()
        .notEmpty()
        .withMessage('Password field is required')
        .isLength({ min: 3, max: 10 })
        .withMessage('Password length should be from 3 to 10 characters')
];

authRouter.post('/signup',
    signUpValidator(), validate,
    async (req: RequestWithBody<SignInDto>, res: Response) =>
        matchI(await getAuthService().registerUser(req.body))({
            success: () => {
                return res.status(StatusCodes.OK).json({ message: 'User has been signed in' })
            },
            failure: ({ error }) => {
                if (error === AuthServiceError.UsernameIsTaken) {
                    return res.status(StatusCodes.CONFLICT).json({ message: error });
                }

                return res.status(StatusCodes.INTERNAL).json({ message: 'Unexpected error' });
            }
        })
);

interface SignInDto { username: string, password: string, }

authRouter.post('/signin',
    async (req: RequestWithBody<SignInDto>, res: Response) =>
        matchI(await getAuthService().createSession(req.body))({
            success: ({ value }) => {
                return res.status(StatusCodes.OK).json({ 
                    accessToken: value.accessToken,
                    rotateToken: value.rotateToken,
                });
            },
            failure: ({ error }) => {
                if (error === AuthServiceError.UserDoesNotExist) {
                    return res.status(StatusCodes.NOT_FOUND).json({ message: error });
                }

                if (error === AuthServiceError.CredentialFailure) {
                    return res.status(StatusCodes.UNAUTHORIZED).json({ message: error });
                }

                // TODO: Throw 'not handled failure case...'
                return res.status(StatusCodes.INTERNAL).json({ message: 'Unexpected error' });
            }
        })
);

authRouter.delete('/signout',
    async (req: Request, res: Response) => {

    }
);

authRouter.post('/signin-anon',
    async (req: Request, res: Response) => {

    }
);

export default authRouter;
