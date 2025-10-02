import { Injectable, NestMiddleware } from "@nestjs/common";
import  { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "src/user/models/user.model";
import { UserService } from "src/user/user.service";

declare global {  // global declaration of the currentUser property in the Request object
  namespace Express {
    interface Request {
      currentUser?: User | null;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.jwt;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await this.userService.findOne(payload._id as string);
        if (!user) throw new Error("User not found from jwt");
        req.currentUser = user; // 👈 এখানে বসানো হচ্ছে
      } catch (err) {
        req.currentUser = null;
      }
    }
    next();
  }
}
