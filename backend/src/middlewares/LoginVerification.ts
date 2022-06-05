import { NextFunction, Request, Response } from "express";

export default function loginVerification(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.session && req.session.user && req.session.user.id) {
        next();
    } else {
        res.sendStatus(401);
    }
}
