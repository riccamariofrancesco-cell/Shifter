import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/crypto
export const getCrypto = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const cryptos = await prisma.crypto.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ cryptos });
  } catch (error) {
    console.error('Error fetching crypto:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/crypto
export const createCrypto = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { name, symbol, quantity = 0, priceUsd = 0 } = req.body;

    if (!name || !symbol) {
      res.status(400).json({ error: 'Name and symbol are required' });
      return;
    }

    const balance = parseFloat(quantity) * parseFloat(priceUsd);

    const crypto = await prisma.crypto.create({
      data: {
        userId,
        name,
        symbol: symbol.toUpperCase(),
        quantity: parseFloat(quantity),
        priceUsd: parseFloat(priceUsd),
        balance: parseFloat(balance),
      },
    });

    res.status(201).json({ crypto });
  } catch (error) {
    console.error('Error creating crypto:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/crypto/:id
export const updateCrypto = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { name, symbol, quantity, priceUsd } = req.body;

    const crypto = await prisma.crypto.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!crypto) {
      res.status(404).json({ error: 'Crypto not found' });
      return;
    }

    const updated = await prisma.crypto.update({
      where: { id: crypto.id },
      data: {
        ...(name !== undefined && { name }),
        ...(symbol !== undefined && { symbol: symbol.toUpperCase() }),
        ...(quantity !== undefined && { quantity: parseFloat(quantity) }),
        ...(priceUsd !== undefined && { priceUsd: parseFloat(priceUsd) }),
        ...(quantity !== undefined || priceUsd !== undefined && {
          balance: parseFloat(quantity || crypto.quantity) * parseFloat(priceUsd || crypto.priceUsd),
        }),
      },
    });

    res.json({ crypto: updated });
  } catch (error) {
    console.error('Error updating crypto:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/crypto/:id
export const deleteCrypto = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const crypto = await prisma.crypto.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!crypto) {
      res.status(404).json({ error: 'Crypto not found' });
      return;
    }

    await prisma.crypto.delete({
      where: { id: crypto.id },
    });

    res.json({ message: 'Crypto deleted successfully' });
  } catch (error) {
    console.error('Error deleting crypto:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};