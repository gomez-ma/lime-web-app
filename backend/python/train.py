from ultralytics import YOLO
import os
import shutil
import glob
import signal
import sys
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ==============================
# 🔷 PATH
# ==============================
DATA_YAML = os.path.join(BASE_DIR, "data.yaml")
RUNS_DIR = os.path.join(BASE_DIR, "../runs/detect")
TARGET_MODEL = os.path.join(BASE_DIR, "../python_service/models/yolo.pt")
PROGRESS_FILE = os.path.join(BASE_DIR, "progress.json")

# ==============================
# 🔷 STATE
# ==============================
stop_flag = False


# ==============================
# 🛑 HANDLE STOP
# ==============================
def handle_sigint(sig, frame):
    global stop_flag
    print("🛑 STOP SIGNAL RECEIVED", flush=True)
    stop_flag = True


signal.signal(signal.SIGINT, handle_sigint)


# ==============================
# 📊 UPDATE PROGRESS
# ==============================
def update_progress(percent, status="training"):
    data = {
        "percent": percent,
        "status": status
    }

    with open(PROGRESS_FILE, "w") as f:
        json.dump(data, f)

    print(f"Progress: {percent}", flush=True)  # 🔥 สำคัญ


# ==============================
# 🔍 FIND BEST MODEL
# ==============================
def get_latest_best_model():
    folders = glob.glob(os.path.join(RUNS_DIR, "train*"))

    if not folders:
        raise Exception("❌ ไม่พบโฟลเดอร์ train")

    latest = max(folders, key=os.path.getctime)

    best_path = os.path.join(latest, "weights", "best.pt")

    if not os.path.exists(best_path):
        raise Exception("❌ ไม่พบ best.pt")

    return best_path


# ==============================
# 🚀 TRAIN
# ==============================
def train():
    print("🔥 TRAIN START", flush=True)

    epochs = 5  # เพิ่มให้ progress smooth
    update_progress(1)

    model = YOLO("yolov8n.pt")

    # --------------------------
    # 🔹 BATCH PROGRESS (smooth)
    # --------------------------
    def on_batch_end(trainer):
        global stop_flag

        if stop_flag:
            raise KeyboardInterrupt

        try:
            total = len(trainer.train_loader)
            current = trainer.batch + 1

            percent = int((current / total) * 80)  # 0-80%
            update_progress(percent)

        except:
            pass

    # --------------------------
    # 🔹 EPOCH PROGRESS
    # --------------------------
    def on_epoch_end(trainer):
        global stop_flag

        if stop_flag:
            raise KeyboardInterrupt

        epoch = trainer.epoch + 1
        percent = 80 + int((epoch / epochs) * 20)  # 80-100%
        update_progress(percent)

    model.add_callback("on_train_batch_end", on_batch_end)
    model.add_callback("on_train_epoch_end", on_epoch_end)

    try:
        model.train(
            data=DATA_YAML,
            epochs=epochs,
            imgsz=640,
            device="cpu"  # 🔥 สำหรับเครื่องคุณ
        )

    except KeyboardInterrupt:
        update_progress(0, "stopped")
        print("❌ Training stopped", flush=True)
        sys.exit(0)

    print("✅ Training finished", flush=True)


# ==============================
# 📦 COPY MODEL
# ==============================
def copy_model():
    print("📦 Copying best model...", flush=True)

    best_model = get_latest_best_model()

    os.makedirs(os.path.dirname(TARGET_MODEL), exist_ok=True)

    shutil.copy(best_model, TARGET_MODEL)

    print(f"✅ Model copied to: {TARGET_MODEL}", flush=True)


# ==============================
# 🧠 MAIN
# ==============================
if __name__ == "__main__":
    try:
        train()
        copy_model()
        update_progress(100, "done")
        print("🎉 DONE", flush=True)

    except Exception as e:
        update_progress(0, "error")
        print("❌ ERROR:", e, flush=True)