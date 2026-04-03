import axios from "axios";
import { useRef, useState, useEffect } from "react";

export default function CameraPredict() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState([]);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 เปิดกล้อง
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      alert("❌ ไม่สามารถเปิดกล้องได้", err);
    }
  };

  // 🔥 ปิดกล้อง
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStream(null);
    }
  };

  // 🔥 Predict
  const runPredict = async (blob) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", blob, "camera.jpg");

      const res = await axios.post(
        "http://localhost:3000/predict",
        formData
      );

      // ✅ FIX ตรงนี้
      const data = res.data.results || [];

      setResult(data);
    } catch (err) {
      console.error(err);
      alert("❌ เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ถ่ายภาพ
  const capture = () => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      const newPreview = URL.createObjectURL(blob);
      setPreview(newPreview);
      setResult([]);

      closeCamera();
      runPredict(blob);
    }, "image/jpeg");
  };

  // cleanup memory
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h3 className="text-center mb-4">📷 Camera Auto Predict</h3>

        {/* Video */}
        {!preview && (
          <div className="text-center">
            <video
              ref={videoRef}
              autoPlay
              className="img-fluid rounded border"
              style={{ maxHeight: "300px" }}
            />
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="text-center">
            <img
              src={preview}
              alt="preview"
              className="img-fluid rounded border"
              style={{ maxHeight: "300px" }}
            />
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Buttons */}
        <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
          <button
            onClick={openCamera}
            className="btn btn-primary"
            disabled={stream}
          >
            🎥 เปิดกล้อง
          </button>

          <button
            onClick={capture}
            className="btn btn-warning"
            disabled={!stream}
          >
            📸 ถ่ายภาพ
          </button>

          <button
            onClick={() => {
              if (preview) URL.revokeObjectURL(preview);
              setPreview(null);
              setResult([]);
            }}
            className="btn btn-secondary"
          >
            🔄 รีเซ็ต
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center mt-3">
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
                  {/* ✅ รองรับทั้ง label และ class */}
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

        {/* Empty */}
        {!loading && preview && result.length === 0 && (
          <div className="alert alert-warning mt-3 text-center">
            ไม่พบผลการทำนาย
          </div>
        )}
      </div>
    </div>
  );
}