let queue = [];
let running = false;

// =======================
// ➕ ADD JOB
// =======================
export const addJob = (job) => {
  queue.push(job);
  console.log(`📥 Job added | queue length: ${queue.length}`);
  runNext();
};

// =======================
// ▶ RUN NEXT
// =======================
const runNext = async () => {
  if (running || queue.length === 0) return;

  running = true;
  const job = queue.shift();

  console.log(`🚀 RUN JOB | remaining: ${queue.length}`);

  try {
    await job(); // 🔥 สำคัญ
    console.log("✅ JOB DONE");
  } catch (err) {
    console.error("❌ JOB ERROR:", err.message);
  } finally {
    running = false;
    runNext(); // 🔥 ไปงานถัดไปเสมอ
  }
};

// =======================
// 📊 STATUS (เพิ่ม)
// =======================
export const getQueueStatus = () => {
  return {
    running,
    queueLength: queue.length,
  };
};