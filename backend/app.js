import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.js";
import predictRoutes from "./routes/predict.js";
import trainRoutes from "./routes/train.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/train", trainRoutes);
app.use("/admin", adminRoutes);
app.use("/predict", predictRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});