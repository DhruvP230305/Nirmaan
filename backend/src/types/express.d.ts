import { Role } from './index.js';

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}
