import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token otentikasi tidak ditemukan' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey_tugas7', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid atau kedaluwarsa' });
    }
    req.user = user;
    next();
  });
};
