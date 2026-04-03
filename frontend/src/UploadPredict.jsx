import axios from "axios";
import { useState, useEffect } from "react";

export default function UploadPredict() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      alert("❗ กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    // cleanup preview เก่า
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult([]);
  };

  // 🔥 Auto Predict
  useEffect(() => {
    if (!file) return;

    const predict = async () => {
      try {
        setLoading(true);

        const form = new FormData();
        form.append("image", file);

        const res = await axios.post(
          "http://localhost:3000/predict",
          form
        );

        // ✅ แก้ตรงนี้
        const data = res.data.results || [];

        setResult(data);
      } catch (err) {
        console.error(err);
        alert("❌ เกิดข้อผิดพลาดในการ Predict");
      } finally {
        setLoading(false);
      }
    };

    predict();
  }, [file]);

  // cleanup preview
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-4">📤 Upload Auto Prediction</h3>

        {/* Upload */}
        <div className="mb-3">
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="text-center mb-3">
            <img
              src={preview}
              alt="preview"
              className="img-fluid rounded border"
              style={{ maxHeight: "250px" }}
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center">
            <div className="spinner-border text-success"></div>
            <p className="mt-2">กำลังวิเคราะห์...</p>
          </div>
        )}

        {/* Result */}
        {!loading && result.length > 0 && (
          <div className="mt-4">
            <h5>ผลการวิเคราะห์</h5>

            <ul className="list-group">
              {result.map((r, i) => (
                <li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {/* fallback กันพัง */}
                  <span>{r.label || r.class || "ไม่ทราบ"}</span>

                  <span className="badge bg-primary">
                    {r.confidence
                      ? (r.confidence * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ไม่มีผล */}
        {!loading && file && result.length === 0 && (
          <div className="alert alert-warning mt-3 text-center">
            ไม่พบผลการทำนาย
          </div>
        )}
      </div>
    </div>
  );
}