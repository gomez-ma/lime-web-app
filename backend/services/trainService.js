import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// fix __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 path ไปยัง train.py
const trainScript = path.join(__dirname, "../python/train.py");

// 🔥 state
let processRef = null;
let status = "idle";
let progress = 0;

// =======================
// 🚀 TRAIN
// =======================
export const startTrain = () => {
  return new Promise((resolve, reject) => {
    // 🔥 ไม่ให้ throw error → กันระบบพัง
    if (status === "training") {
      console.log("⚠️ Already training, skip");
      return resolve("Already training");
    }

    console.log("🔥 START TRAIN:", trainScript);

    const process = spawn("python", [trainScript]);

    processRef = process;
    status = "training";
    progress = 0;

    let finished = false; // 🔥 กัน resolve/reject ซ้ำ

    // stdout
    process.stdout.on("data", (data) => {
      const text = data.toString();
      console.log("📊", text);

      const match = text.match(/Progress:\s*(\d+)/);
      if (match) {
        progress = parseInt(match[1]);
      }
    });

    // stderr
    process.stderr.on("data", (data) => {
      console.error("❌ ERROR:", data.toString());
    });

    // error
    process.on("error", (err) => {
      if (finished) return;
      finished = true;

      console.error("❌ SPAWN ERROR:", err);
      status = "error";
      processRef = null;

      reject(err);
    });

    // close
    process.on("close", (code, signal) => {
      if (finished) return;
      finished = true;

      console.log("🔚 CLOSE:", { code, signal, status });

      processRef = null;

      // 🛑 stop
      if (status === "stopped" || signal === "SIGINT") {
        console.log("🛑 Train stopped");
        progress = 0;
        return resolve("Train stopped");
      }

      // ✅ success
      if (code === 0) {
        status = "done";
        progress = 100;
        return resolve("Train Model สำเร็จแล้ว");
      }

      // ❌ error
      status = "error";
      reject(new Error("Train failed"));
    });
  });
};

// =======================
// 🛑 STOP
// =======================
export const stopTrain = () => {
  if (processRef) {
    console.log("🛑 STOP TRAIN");

    status = "stopped"; // 🔥 สำคัญ
    processRef.kill("SIGINT");
  }
};

// =======================
// 📊 STATUS
// =======================
export const getStatus = () => {
  return {
    status,
    progress,
  };
};