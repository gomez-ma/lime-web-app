import axios from "axios";
import { useState } from "react";

export default function TrainModel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const train = async () => {
    try {
      setLoading(true);
      setMessage("");
      setSuccess(false);

      await axios.post("http://localhost:3000/admin/train");

      setSuccess(true);
      setMessage("เริ่ม Train Model แล้ว");
    } catch (err) {
      console.error(err);
      setSuccess(false);
      setMessage("Train ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 text-center">
        <h3 className="mb-4">🧠 Train Model</h3>

        {/* 📌 Button */}
        <div className="d-grid gap-2 col-6 mx-auto">
          <button
            onClick={train}
            disabled={loading}
            className="btn btn-success btn-lg"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                กำลัง Train...
              </>
            ) : (
              "🚀 เริ่ม Train"
            )}
          </button>
        </div>

        {/* 📌 Message */}
        {message && (
          <div
            className={`alert mt-4 ${
              success ? "alert-success" : "alert-danger"
            }`}
          >
            {success && (
              <span className="spinner-border spinner-border-sm me-2"></span>
            )}
            {message}
          </div>
        )}
      </div>
    </div>
  );
}