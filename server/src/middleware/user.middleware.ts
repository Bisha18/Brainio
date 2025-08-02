import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// It's good practice to extend the Express Request type for type safety
// You could create a types.d.ts file for this, but for simplicity, we'll cast.
// export interface IRequestWithUser extends Request {
//   _id?: string;
// }

const userMiddlware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    
    // Check for the "Bearer " scheme.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided or malformed header" });
    }
    
    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    const jwt_secret = process.env.JWT_TOKEN;
    if (!jwt_secret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const decoded = jwt.verify(token, jwt_secret) as { id?: string };

    if (decoded && typeof decoded === "object" && decoded.id) {
      // Attach user id to the request object for downstream handlers
      (req as any)._id = decoded.id;
      next();
    } else {
      // If the token is valid but doesn't have the id, it's a bad token.
      return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }
  } catch (error) {
    // Catches errors from jwt.verify (e.g., expired, malformed)
    console.error("JWT Verification Error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
}

export default userMiddlware;