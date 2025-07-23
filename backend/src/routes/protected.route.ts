import express from 'express';
import { parseShoppingList } from '../services/ai/ai.service';
import { Requirement } from '../models/requirement.model';
import { addToQueue } from '../services/queue/queue.service';

const router = express.Router();

router.post('/queue', (req, res) => {
  const requirements: Requirement[] = req.body.requirements;
  console.log(requirements);
  addToQueue(requirements);
  res.status(201).send({ message: 'Requirement added to queue' });
});

router.post('/requirement-parsing', async (req, res) => {
  const query: string = req.body.query;  
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
