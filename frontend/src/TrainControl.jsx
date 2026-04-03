import axios from "axios";
import { useEffect, useState } from "react";

export default function TrainControl() {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);

  const startTrain = async () => {
    if (status === "training") return;
    await axios.post("http://localhost:3000/train/start");
  };

  const stopTrain = async () => {
    await axios.post("http://localhost:3000/train/stop");
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get("http://localhost:3000/train/status");
        setStatus(res.data.status);
        setProgress(res.data.progress);
      } catch (err) {
        console.error(err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 helper
  const isTraining = status === "training";

  return (
    <div className="text-center">

      <h5 className="fw-bold mb-3">🧠 Train Model</h5>

      <p className="mb-2">
        สถานะ: <span className="fw-bold">{status}</span>
      </p>

      <div className="progress mb-3" style={{ height: "20px" }}>
        <div
          className="progress-bar bg-success progress-bar-striped"
          style={{ width: `${progress}%` }}
        >
          {progress}%
        </div>
      </div>

      <div className="d-flex justify-content-center gap-2">

        {/* 🔥 START BUTTON */}
        <button
          onClick={startTrain}
          className="btn btn-success d-flex align-items-center gap-2"
          disabled={isTraining}
        >
          {isTraining ? (
            <>
              <span className="spinner-border spinner-border-sm"></span>
              Training...
            </>
          ) : (
            <>
              <i class="bi bi-play-fill"></i> Start
            </>
          )}
        </button>

        {/* 🔥 STOP BUTTON */}
        <button
          onClick={stopTrain}
          className="btn btn-danger"
          disabled={!isTraining}
        >
          <i className="bi bi-stop-fill"></i> Stop
        </button>

      </div>

    </div>
  );
}