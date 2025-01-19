import { Request, Response, NextFunction } from 'express';

type AsyncConrtroller = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>

const catchErrors = (controller: AsyncConrtroller): AsyncConrtroller => 
    async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }
    };

export default catchErrors;