import express from 'express';

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

router.post('/match', async (req, res) => {
  const search: string = req.body.search;
  try {
    //const match = await searchWithAiModel(search, queue);
    const match = "TESZT";
    if (!match) {
      return res.status(404).send({ error: 'No matching requirement found' });
    }
    res.send(match);
  } catch (error) {
    res.status(500).send({ error: 'AI model matching failed' });
  }
});

export default router;
