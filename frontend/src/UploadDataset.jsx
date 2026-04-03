import axios from "axios";
import { useState } from "react";

export default function UploadDataset() {
  const [files, setFiles] = useState([]);
  const [label, setLabel] = useState("ripe");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔥 handle file change
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (!selectedFiles || selectedFiles.length === 0) {
      setFiles([]);
      return;
    }

    // ✅ filter เฉพาะรูป
    const images = selectedFiles.filter((f) =>
      f.type.startsWith("image/")
    );

    if (images.length !== selectedFiles.length) {
      alert("❗ บางไฟล์ไม่ใช่รูปภาพ จะถูกตัดออก");
    }

    setFiles(images);
    setMessage("");
  };

  // 🔥 upload
  const upload = async () => {
    if (!files || files.length === 0) {
      alert("❗ กรุณาเลือกไฟล์ก่อนอัปโหลด");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const form = new FormData();

      files.forEach((f) => form.append("images", f));
      form.append("label", label);

      await axios.post("http://localhost:3000/admin/upload", form);

      setMessage("✅ Upload สำเร็จ");
      setFiles([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ เกิดข้อผิดพลาดในการอัปโหลด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-4">📤 Upload Dataset</h3>

        {/* 📌 File input */}
        <div className="mb-3">
          <input
            type="file"
            multiple
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {/* 📌 File count */}
        {files.length > 0 && (
          <div className="alert alert-info">
            เลือกแล้ว {files.length} ไฟล์
          </div>
        )}

        {/* 📌 Label select */}
        <div className="mb-3">
          <label className="form-label">เลือก Label</label>
          <select
            className="form-select"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          >
            <option value="unripe">ดิบ (Unripe)</option>
            <option value="ripe">สุก (Ripe)</option>
            <option value="overripe">สุกเกิน (Overripe)</option>
          </select>
        </div>

        {/* 📌 Button */}
        <div className="d-grid">
          <button
            onClick={upload}
            disabled={loading || files.length === 0}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                กำลังอัปโหลด...
              </>
            ) : (
              "📤 Upload"
            )}
          </button>
        </div>

        {/* 📌 Message */}
        {message && (
          <div
            className={`alert mt-3 ${
              message.includes("❌") ? "alert-danger" : "alert-success"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}