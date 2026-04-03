from ultralytics import YOLO
import sys
import json

image_path = sys.argv[1]

model = YOLO("models/yolo.pt")  # ใช้ model ที่ train แล้ว

results = model(image_path)

output = []

for r in results:
    for box in r.boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        conf = float(box.conf[0])
        cls = int(box.cls[0])

        label_map = {
            0: "unripe",
            1: "ripe",
            2: "overripe"
        }

        output.append({
            "bbox": [x1, y1, x2, y2],
            "confidence": conf,
            "label": label_map.get(cls, "unknown")
        })

print(json.dumps(output))