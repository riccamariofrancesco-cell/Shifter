import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { sourceName, type, amount } = req.body;

    // Validate input
    if (!sourceName || !type || typeof amount !== 'number') {
      res.status(400).json({ error: 'Source name, type, and amount are required' });
      return;
    }

    // Validate account type
    const validTypes = ['checking', 'savings', 'debit_card'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ error: 'Invalid account type' });
      return;
    }

    const account = await prisma.account.create({
      data: {
        sourceName,
        type,
        amount,
        userId,
      },
    });

    res.status(201).json({ account });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { sourceName, type, amount } = req.body;

    // Validate input
    if (!sourceName || !type || typeof amount !== 'number') {
      res.status(400).json({ error: 'Source name, type, and amount are required' });
      return;
    }

    // Validate account type
    const validTypes = ['checking', 'savings', 'debit_card'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ error: 'Invalid account type' });
      return;
    }

    const account = await prisma.account.updateMany({
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

    if (account.count === 0) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.json({ message: 'Account updated successfully' });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const account = await prisma.account.deleteMany({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (account.count === 0) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};