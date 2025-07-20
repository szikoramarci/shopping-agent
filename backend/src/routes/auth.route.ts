import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

const attemptsByIp = new Map<string, { count: number; lastAttempt: number }>();
const MAX_DELAY_MS = 10000;
const ATTEMPT_DECAY_MS = 5 * 60 * 1000; // 5 perc

function getDelayForAttempts(count: number): number {
  return Math.min(MAX_DELAY_MS, count ** 2 * 1000);
}

function incrementAttempts(ip: string): number {
  const current = attemptsByIp.get(ip) || { count: 0, lastAttempt: Date.now() };
  current.count += 1;
  current.lastAttempt = Date.now();
  attemptsByIp.set(ip, current);
  return current.count;
}

function scheduleAttemptReduction(ip: string): void {
  setTimeout(() => {
    const data = attemptsByIp.get(ip);
    if (!data) return;
    if (data.count > 1) {
      data.count -= 1;
      attemptsByIp.set(ip, data);
    } else {
      attemptsByIp.delete(ip);
    }
  }, ATTEMPT_DECAY_MS);
}

function createToken(): string {
  return jwt.sign({ role: "user" }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
}

async function isPinValid(pin: string, ip: string): Promise<boolean> {
  const correctPin = process.env.AUTH_PIN;
  const isValid = pin === correctPin;
  if (!isValid) {
    const attemptCount = incrementAttempts(ip);
    scheduleAttemptReduction(ip);
    const delay = getDelayForAttempts(attemptCount);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return isValid;
}

router.post("/login", async (req, res) => {
  const { pin } = req.body;
  const ip = req.ip || "unknown";

  if (!(await isPinValid(pin, ip))) {
    return res.status(401).send({ error: "Hibás PIN" });
  }

  attemptsByIp.delete(ip);
  res.json({ token: createToken() });
});

export default router;
