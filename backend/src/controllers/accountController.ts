import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/accounts
export const getAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/accounts
export const createAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { name, type = 'conto', balance = 0 } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Account name is required' });
      return;
    }

    const account = await prisma.account.create({
      data: {
        userId,
        name,
        type,
        balance: parseFloat(balance),
      },
    });

    res.status(201).json({ account });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/accounts/:id
export const updateAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { name, type, balance } = req.body;

    const account = await prisma.account.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const updated = await prisma.account.update({
      where: { id: account.id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(balance !== undefined && { balance: parseFloat(balance) }),
      },
    });

    res.json({ account: updated });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/accounts/:id
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const account = await prisma.account.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    await prisma.account.delete({
      where: { id: account.id },
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};