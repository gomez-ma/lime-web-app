import UploadDataset from "./UploadDataset";
import UploadPredict from "./UploadPredict";
import CameraPredict from "./CameraPredict";
import TrainControl from "./TrainControl";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function App() {
  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">

        {/* 🔥 Header */}
        <div className="text-center mb-4">
          <h1 className="fw-bold">🍋 Lime Maturity Detection System (AI)</h1>
          <p className="text-muted">
            ระบบตรวจความสุกของมะนาว (AI)
          </p>
        </div>

        {/* 🔥 Upload Dataset */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <UploadDataset />
          </div>
        </div>

        {/* 🔥 Train Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <TrainControl />
          </div>
        </div>

        {/* 🔥 Predict Section */}
        <div className="row g-4">

          {/* Upload Predict */}
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <UploadPredict />
              </div>
            </div>
          </div>

          {/* Camera Predict */}
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <CameraPredict />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}