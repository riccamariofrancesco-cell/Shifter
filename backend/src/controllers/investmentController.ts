import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/investments
export const getInvestments = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const investments = await prisma.investment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ investments });
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/investments
export const createInvestment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { name, type, balance = 0 } = req.body;

    if (!name || !type) {
      res.status(400).json({ error: 'Name and type are required' });
      return;
    }

    const investment = await prisma.investment.create({
      data: {
        userId,
        name,
        type,
        balance: parseFloat(balance),
      },
    });

    res.status(201).json({ investment });
  } catch (error) {
    console.error('Error creating investment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/investments/:id
export const updateInvestment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { name, type, balance } = req.body;

    const investment = await prisma.investment.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!investment) {
      res.status(404).json({ error: 'Investment not found' });
      return;
    }

    const updated = await prisma.investment.update({
      where: { id: investment.id },
      data: {
        ...(name !== undefined && { name }),
        ...(type !== undefined && { type }),
        ...(balance !== undefined && { balance: parseFloat(balance) }),
      },
    });

    res.json({ investment: updated });
  } catch (error) {
    console.error('Error updating investment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/investments/:id
export const deleteInvestment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const investment = await prisma.investment.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!investment) {
      res.status(404).json({ error: 'Investment not found' });
      return;
    }

    await prisma.investment.delete({
      where: { id: investment.id },
    });

    res.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    console.error('Error deleting investment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};