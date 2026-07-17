import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../utils/jwtUtils';

const prisma = new PrismaClient();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.token;
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check if session exists and is valid
    const session = await prisma.session.findFirst({
      where: {
        token,
        userId: decoded.userId,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      return res.status(401).json({ error: 'Session not found or expired' });
    }

    // Get user details (excluding password)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to request for downstream handlers
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};