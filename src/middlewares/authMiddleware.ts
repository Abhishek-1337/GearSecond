import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../types/auth";

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            res.status(403).json({
                message: "Token is invalid."
            });
            return;
        }

        const token = req.headers.authorization.split(" ")[1];
        const decoded = await jwt.verify(token, process.env.jwt_key as string);
        
        if(!decoded){
            res.status(403).json({
                message: "Token is invalid."
            });
            return;
        }

        req.userId = (decoded as JwtPayload).userId;
        next();
    }
    catch(ex) {

    }
}