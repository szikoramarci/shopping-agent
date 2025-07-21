import express from 'express';
import { parseShoppingList } from '../services/ai';

const router = express.Router();

export type Requirement = {
  product: string;
  description: string;
  unit: string;
  amount: number;
};

const queue: Requirement[] = [];

router.post('/queue', (req, res) => {
  const requirement: Requirement = req.body;
  queue.push(requirement);
  res.status(201).send({ message: 'Requirement added to queue' });
});

router.post('/requirement-parsing', async (req, res) => {
  const query: string = req.body.query;
  console.log(query);
  try {
    const match = await parseShoppingList(query);
    if (!match) {
      return res.status(404).send({ error: 'No matching requirement found' });
    }
    res.send(match);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'AI model matching failed' });
  }
});

export default router;
