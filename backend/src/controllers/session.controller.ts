import { NOT_FOUND, OK, BAD_REQUEST } from "../constants/http";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import {z} from 'zod';

export const getAllSessionsHandler = catchErrors(async(req, res)=> {
    const sessions = await SessionModel.find({
        userId: req.userId, expiresAt: {$gt: new Date()}
    },
    {
        _id: 1,
        userAgent: 1,
        createdAt: 1,
    },
    {
        sort: { createdAt: -1},
    }
);
    appAssert(sessions, NOT_FOUND, 'No active sessions found');

    return res.status(OK).json(
        sessions.map((session)=>({
            ...session.toObject(),
            ...(
                session.id === req.sessionId && {
                    isCurrent: true,
                }
            )
        }))
    );
});

export const deleteSessionHandler = catchErrors(async(req,res)=> {
    const sessionId = z.string().parse(req.params.id);

    appAssert(sessionId!==req.sessionId,BAD_REQUEST,'Cannot delete active session ID');

    const session = await SessionModel.findOne({
        _id: sessionId,
        userId: req.userId,
        expiresAt: {$gt: new Date()},
    });
    appAssert(session, NOT_FOUND, 'Valid Session not found');

    await session.deleteOne();

    return res.status(OK).json({
        message: 'Session removed',
    })
})