import express from "express";
import { parseShoppingList } from "../services/ai/ai.service";
import { Requirement } from "../models/requirement.model";
import { addToQueue } from "../services/queue/queue.service";
import { completedQueue, failedQueue, queue } from "../states/queue.state";

const router = express.Router();

router.post("/queue", (req, res) => {
  const requirements: Requirement[] = req.body.requirements;
  console.log(requirements);
  addToQueue(requirements);
  res.status(201).send({ message: "Requirement added to queue" });
});

router.post("/requirement-parsing", async (req, res) => {
  const query: string = req.body.query;
  try {
    const match = await parseShoppingList(query);
    if (!match) {
      return res.status(404).send({ error: "No matching requirement found" });
    }
    res.send(match);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "AI model matching failed" });
  }
});

router.get("/queue/:status", (req, res) => {
  const queueMap = {
    pending: queue,
    completed: completedQueue,
    failed: failedQueue,
  } as const;
  
  const status = req.params.status as keyof typeof queueMap;
  const data = queueMap[status];

  if (!data) {
    return res.status(400).json({
      error: 'Invalid status. Use "pending", "completed", or "failed".',
    });
  }

  res.json({
    status: "OK",
    data,
  });
});

export default router;
