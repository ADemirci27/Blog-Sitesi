import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function getUserFromToken(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) return null;

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    return {
      id: decoded.id,
      username: decoded.username
    };

  } catch (error) {
    return null;
  }
}
