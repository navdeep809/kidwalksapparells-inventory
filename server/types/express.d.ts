// types/express.d.ts
import { UserRole } from "@prisma/client"; // adjust path if needed

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      role: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
