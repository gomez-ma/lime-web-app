from fastapi import FastAPI, UploadFile, File, HTTPException
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI()

# Load the YOLO model
model = YOLO("models/yolo.pt")

label_map = {
    0: "ดิบ 🟢",
    1: "สุก 🟡",
    2: "สุกเกิน 🔴"
}

# =========================
# HEALTH CHECK (เพิ่ม)
# =========================
@app.get("/")
def root():
    return {"status": "API running"}

# =========================
# PREDICT
# =========================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        # กันไฟล์เสีย
        image = Image.open(io.BytesIO(contents)).convert("RGB")

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # inference
    results = model(image)

    output = []

    for r in results:
        if r.boxes is None:
            continue

        for box in r.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            cls = int(box.cls[0])
            conf = float(box.conf[0])

            output.append({
                "bbox": [round(x1, 2), round(y1, 2), round(x2, 2), round(y2, 2)],
                "label": label_map.get(cls, "unknown"),
                "confidence": round(conf, 4)
            })

    return {
        "count": len(output),
        "results": output
    }