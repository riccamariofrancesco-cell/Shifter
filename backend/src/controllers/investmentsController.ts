import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getInvestments = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const investments = await prisma.investment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ investments });
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createInvestment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { sourceName, type, amount } = req.body;

    // Validate input
    if (!sourceName || !type || typeof amount !== 'number') {
      res.status(400).json({ error: 'Source name, type, and amount are required' });
      return;
    }

    // Validate investment type
    const validTypes = ['stocks', 'etfs', 'funds', 'bonds'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ error: 'Invalid investment type' });
      return;
    }

    const investment = await prisma.investment.create({
      data: {
        sourceName,
        type,
        amount,
        userId,
      },
    });

    res.status(201).json({ investment });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateInvestment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { sourceName, type, amount } = req.body;

    // Validate input
    if (!sourceName || !type || typeof amount !== 'number') {
      res.status(400).json({ error: 'Source name, type, and amount are required' });
      return;
    }

    // Validate investment type
    const validTypes = ['stocks', 'etfs', 'funds', 'bonds'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ error: 'Invalid investment type' });
      return;
    }

    const investment = await prisma.investment.updateMany({
      where: {
        id: parseInt(id),
        userId,
      },
      data: {
        sourceName,
        type,
        amount,
      },
    });

    if (investment.count === 0) {
      res.status(404).json({ error: 'Investment not found' });
      return;
    }

    res.json({ message: 'Investment updated successfully' });
  } catch (error) {
    console.error('Update investment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteInvestment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const investment = await prisma.investment.deleteMany({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (investment.count === 0) {
      res.status(404).json({ error: 'Investment not found' });
      return;
    }

    res.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Delete investment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};