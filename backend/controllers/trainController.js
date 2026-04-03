import { startTrain, stopTrain, getStatus } from "../services/trainService.js";
import { addJob } from "../services/queueService.js";

export const train = (req, res) => {
  console.log("🔥 TRAIN API HIT");
  
  addJob(async () => {
    startTrain();
  });

  res.json({ message: "Train queued" });
};

export const stop = (req, res) => {
  stopTrain();
  res.json({ message: "Stopped" });
};

export const status = (req, res) => {
  res.json(getStatus());
};