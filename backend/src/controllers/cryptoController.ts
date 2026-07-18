import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getCryptos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const cryptos = await prisma.crypto.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ cryptos });
  } catch (error) {
    console.error('Get cryptos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCrypto = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { sourceName, type, amount } = req.body;

    // Validate input
    if (!sourceName || !type || typeof amount !== 'number') {
      res.status(400).json({ error: 'Source name, type, and amount are required' });
      return;
    }

    // Validate crypto type (common cryptocurrencies)
    const validTypes = ['BTC', 'ETH', 'LTC', 'BCH', 'XRP', 'ADA', 'DOT', 'LINK'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ error: 'Invalid cryptocurrency type' });
      return;
    }

    const crypto = await prisma.crypto.create({
      data: {
        sourceName,
        type,
        amount,
        userId,
      },
    });

    res.status(201).json({ crypto });
  } catch (error) {
    console.error('Create crypto error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCrypto = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { sourceName, type, amount } = req.body;

    // Validate input
    if (!sourceName || !type || typeof amount !== 'number') {
      res.status(400).json({ error: 'Source name, type, and amount are required' });
      return;
    }

    // Validate crypto type
    const validTypes = ['BTC', 'ETH', 'LTC', 'BCH', 'XRP', 'ADA', 'DOT', 'LINK'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ error: 'Invalid cryptocurrency type' });
      return;
    }

    const crypto = await prisma.crypto.updateMany({
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

    if (crypto.count === 0) {
      res.status(404).json({ error: 'Cryptocurrency not found' });
      return;
    }

    res.json({ message: 'Cryptocurrency updated successfully' });
  } catch (error) {
    console.error('Update crypto error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCrypto = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const crypto = await prisma.crypto.deleteMany({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (crypto.count === 0) {
      res.status(404).json({ error: 'Cryptocurrency not found' });
      return;
    }

    res.json({ message: 'Cryptocurrency deleted successfully' });
  } catch (error) {
    console.error('Delete crypto error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};